import { db } from '$lib/server/db';
import { auditLogs, users } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.role !== 'auditor' && locals.user?.role !== 'admin') {
		throw redirect(303, '/');
	}

	const logs = await db.select({
        id: auditLogs.id,
        tableName: auditLogs.tableName,
        rowId: auditLogs.rowId,
        action: auditLogs.action,
        oldData: auditLogs.oldData,
        newData: auditLogs.newData,
        createdAt: auditLogs.createdAt,
        userName: users.name
    })
    .from(auditLogs)
    .leftJoin(users, eq(auditLogs.userId, users.id))
    .orderBy(sql`${auditLogs.createdAt} DESC`)
    .limit(100);

	return {
		logs
	};
};
