import { db } from '$lib/server/db';
import { programs } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'auditor') {
		throw redirect(303, '/');
	}

	const allPrograms = await db.select().from(programs).execute();

	return {
		programs: allPrograms
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		if (locals.user?.role !== 'admin') {
			return fail(403, { message: 'Unauthorized' });
		}

		const data = await request.formData();
		const name = data.get('name') as string;
		const category = data.get('category') as string;
		const code = data.get('code') as string;
		const budgetYear = parseInt(data.get('budgetYear') as string);

		if (!name || !category || !code || !budgetYear) {
			return fail(400, { message: 'All fields are required' });
		}

		// Check for duplication (Same Code in Same Budget Year) - Requirement Skenario 1
		const existing = await db.select()
			.from(programs)
			.where(and(eq(programs.code, code), eq(programs.budgetYear, budgetYear)));

		if (existing.length > 0) {
			return fail(400, { message: 'Kode rekening ini sudah terdaftar untuk tahun anggaran ini.' });
		}

		const [result] = await db.insert(programs).values({
			name,
			category,
			code,
			budgetYear,
			createdBy: locals.user.id,
			status: 'diajukan'
		});

		await logAudit('programs', result.insertId, 'CREATE', null, { name, category, code, budgetYear }, locals.user.id);

		return { success: true, programId: result.insertId };
	}
};
