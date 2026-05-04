import { db } from '$lib/server/db';
import { programs, realizations } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { logAudit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'pelaksana' && locals.user?.role !== 'admin' && locals.user?.role !== 'auditor') {
		throw redirect(303, '/');
	}

	const approvedPrograms = await db.select({
        id: programs.id,
        name: programs.name,
        code: programs.code,
        totalBudget: programs.totalBudget,
        spent: sql<number>`(SELECT COALESCE(SUM(${realizations.amount}), 0) FROM ${realizations} WHERE ${realizations.programId} = ${programs.id})`
    })
    .from(programs)
    .where(eq(programs.status, 'approved'));

    const recentRealizations = await db.select()
        .from(realizations)
        .orderBy(sql`${realizations.createdAt} DESC`)
        .limit(10);

	return {
		programs: approvedPrograms,
        recentRealizations
	};
};

export const actions: Actions = {
	submit: async ({ request, locals }) => {
		if (locals.user?.role !== 'pelaksana' && locals.user?.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const programId = parseInt(data.get('programId') as string);
		const amount = parseFloat(data.get('amount') as string);
		const description = data.get('description') as string;
		const latitude = data.get('latitude') as string;
		const longitude = data.get('longitude') as string;
		const evidenceFile = data.get('evidence') as File;

		if (!programId || isNaN(amount) || !description) {
			return fail(400, { message: 'Data tidak lengkap' });
		}

		// Requirement Skenario 3: Validation against remaining budget
		const [program] = await db.select({
            totalBudget: programs.totalBudget,
            spent: sql<number>`(SELECT COALESCE(SUM(${realizations.amount}), 0) FROM ${realizations} WHERE ${realizations.programId} = ${programs.id})`
        })
        .from(programs)
        .where(eq(programs.id, programId));

		if (!program) return fail(404, { message: 'Program tidak ditemukan' });
        
        const remaining = parseFloat(program.totalBudget) - Number(program.spent);
        if (amount > remaining) {
            return fail(400, { message: `Jumlah realisasi melebihi sisa pagu anggaran! (Sisa: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(remaining)})` });
        }

		// Handle File Upload
		let evidenceUrl = '';
		if (evidenceFile && evidenceFile.size > 0) {
			const uploadDir = path.join(process.cwd(), 'static', 'uploads');
			if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
			
			const fileName = `${Date.now()}-${evidenceFile.name}`;
			const filePath = path.join(uploadDir, fileName);
			const buffer = Buffer.from(await evidenceFile.arrayBuffer());
			fs.writeFileSync(filePath, buffer);
			evidenceUrl = `/uploads/${fileName}`;
		}

		const [res] = await db.insert(realizations).values({
			programId,
			userId: locals.user.id,
			amount: amount.toString(),
			description,
			evidenceUrl,
			latitude,
			longitude
		});

		await logAudit('realizations', res.insertId, 'CREATE', null, { amount, description, programId }, locals.user.id);

		return { success: true };
	}
};
