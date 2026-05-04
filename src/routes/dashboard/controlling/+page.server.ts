import { db } from '$lib/server/db';
import { programs } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'dprd' && locals.user?.role !== 'admin' && locals.user?.role !== 'auditor') {
		throw redirect(303, '/');
	}

	const pengajuan = await db.select().from(programs).where(eq(programs.status, 'diajukan'));

	return {
		programs: pengajuan
	};
};

export const actions: Actions = {
	approve: async ({ request, locals }) => {
		if (locals.user?.role !== 'dprd' && locals.user?.role !== 'admin') {
			return fail(403, { message: 'Hanya DPRD yang bisa menyetujui anggaran.' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);
		const [program] = await db.select().from(programs).where(eq(programs.id, id));

		// Logic: Update status to approved AND Lock the budget (Requirement Skenario 2)
		await db.update(programs)
			.set({ 
				status: 'approved',
				isLocked: true 
			})
			.where(eq(programs.id, id));

		await logAudit('programs', id, 'UPDATE', 
			{ status: program.status, isLocked: program.isLocked }, 
			{ status: 'approved', isLocked: true }, 
			locals.user.id
		);

		return { success: true };
	},

	reject: async ({ request, locals }) => {
		if (locals.user?.role !== 'dprd' && locals.user?.role !== 'admin') {
			return fail(403, { message: 'Hanya DPRD yang bisa menolak anggaran.' });
		}

		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		await db.update(programs)
			.set({ status: 'rejected' })
			.where(eq(programs.id, id));

		return { success: true };
	}
};
