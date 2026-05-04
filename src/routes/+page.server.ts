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
        totalBudget: programs.totalBudget,
        totalRealization: sql<number>`COALESCE(SUM(${realizations.amount}), 0)`
    })
    .from(programs)
    .leftJoin(realizations, sql`${programs.id} = ${realizations.programId}`)
    .groupBy(programs.id)
    .execute();

    // Summary data
    const summary = await db.select({
        totalBudget: sql<number>`SUM(${programs.totalBudget})`,
        totalRealization: sql<number>`(SELECT SUM(${realizations.amount}) FROM ${realizations})`
    })
    .from(programs)
    .execute();

    return {
        programs: programData,
        summary: summary[0] || { totalBudget: 0, totalRealization: 0 }
    };
};
