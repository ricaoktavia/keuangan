import { db } from '$lib/server/db';
import { programs, programItems, standardPrices } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin' && locals.user?.role !== 'auditor') {
		throw redirect(303, '/');
	}

	const programId = parseInt(params.id);
	if (isNaN(programId)) throw redirect(303, '/dashboard/planning');
	
	const [program] = await db.select().from(programs).where(eq(programs.id, programId));
	if (!program) throw redirect(303, '/dashboard/planning');

	const items = await db.select().from(programItems).where(eq(programItems.programId, programId));
	const prices = await db.select().from(standardPrices).execute();

	return {
		program,
		items,
		standardPrices: prices
	};
};

export const actions: Actions = {
	addItem: async ({ request, params, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { message: 'Unauthorized' });
		
		const programId = parseInt(params.id);
		if (isNaN(programId)) return fail(400, { message: 'Invalid ID' });
		const [program] = await db.select().from(programs).where(eq(programs.id, programId));
		if (program.isLocked) return fail(400, { message: 'Program sudah terkunci dan tidak bisa diubah.' });

		const data = await request.formData();
		const itemName = data.get('itemName') as string;
		const unitPrice = parseFloat(data.get('unitPrice') as string);
		const quantity = parseInt(data.get('quantity') as string);

		if (!itemName || isNaN(unitPrice) || isNaN(quantity)) {
			return fail(400, { message: 'Data tidak valid' });
		}

		const totalPrice = (unitPrice * quantity).toString();

		// Check against standard price (Requirement Skenario 1)
		const [stdPrice] = await db.select().from(standardPrices).where(eq(standardPrices.itemName, itemName));
		let warning = null;
		if (stdPrice && unitPrice > parseFloat(stdPrice.maxPrice)) {
			warning = `Peringatan: Harga satuan melebihi standar daerah (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(stdPrice.maxPrice))})`;
		}

		const [res] = await db.insert(programItems).values({
			programId,
			itemName,
			unitPrice: unitPrice.toString(),
			quantity,
			totalPrice
		});

		await logAudit('program_items', res.insertId, 'CREATE', null, { itemName, unitPrice, quantity, totalPrice }, locals.user.id);

		// Update total budget in programs table
		await db.update(programs)
			.set({ 
				totalBudget: sql`${programs.totalBudget} + ${totalPrice}` 
			})
			.where(eq(programs.id, programId));

		return { success: true, warning };
	},

	submitForApproval: async ({ params, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { message: 'Unauthorized' });
		
		const id = parseInt(params.id);
		if (isNaN(id)) return fail(400, { message: 'Invalid ID' });
		const [program] = await db.select().from(programs).where(eq(programs.id, id));

		await db.update(programs)
			.set({ status: 'diajukan' })
			.where(eq(programs.id, id));

		await logAudit('programs', id, 'UPDATE', { status: program.status }, { status: 'diajukan' }, locals.user.id);

		return { success: true };
	},

	deleteItem: async ({ request, params, locals }) => {
		if (locals.user?.role !== 'admin') return fail(403, { message: 'Unauthorized' });
		
		const id = parseInt((await request.formData()).get('id') as string);
		const programId = parseInt(params.id);
		if (isNaN(programId) || isNaN(id)) return fail(400, { message: 'Invalid ID' });

		const [item] = await db.select().from(programItems).where(eq(programItems.id, id));
		if (item) {
			await db.delete(programItems).where(eq(programItems.id, id));
			await db.update(programs)
				.set({ totalBudget: sql`${programs.totalBudget} - ${item.totalPrice}` })
				.where(eq(programs.id, programId));
		}

		return { success: true };
	}
};
