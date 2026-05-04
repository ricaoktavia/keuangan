import { db } from '$lib/server/db';
import { programs, realizations } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // Fetch all programs with their total budget and total realization
    const programData = await db.select({
        id: programs.id,
        name: programs.name,
        category: programs.category,
        code: programs.code,
        totalBudget: programs.totalBudget,
        totalRealization: sql<number>`COALESCE(SUM(${realizations.amount}), 0)`
    })
    .from(programs)
    .leftJoin(realizations, sql`${programs.id} = ${realizations.programId}`)
    .groupBy(programs.id)
    .execute();

    return {
        programs: programData
    };
};
