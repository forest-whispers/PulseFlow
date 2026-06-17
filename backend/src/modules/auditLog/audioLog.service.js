import AuditLog from './auditLog.model.js';

export const createAuditLogService=async (actor, action, entityType, entityId, metadata={})=>
{
    const log=await AuditLog.create({actor, action, entityType, entityId, metadata});
    return log;
};