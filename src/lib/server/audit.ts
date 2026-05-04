import { db } from '$lib/server/db';
import { auditLogs } from '$lib/server/db/schema';

export async function logAudit(
    tableName: string, 
    rowId: number, 
    action: 'CREATE' | 'UPDATE' | 'DELETE', 
    oldData: any, 
    newData: any, 
    userId: number | null
) {
    try {
        await db.insert(auditLogs).values({
            tableName,
            rowId,
            action,
            oldData,
            newData,
            userId,
        });
    } catch (error) {
        console.error('Failed to log audit:', error);
    }
}
