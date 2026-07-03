import { Request, Response } from 'express';
import { RBACService } from '../services/rbac.service';
import { catchAsync } from '../utils/catchAsync';
import { UserRole } from '../models/UserRole';
import { PermissionAudit, PermissionAuditAction } from '../models/PermissionAudit';

export const getMyPermissionsController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const tenantId = (req.user as any).tenantId; 

  const permissions = await RBACService.getUserPermissions(userId, tenantId);

  res.status(200).json({ success: true, data: permissions });
});

export const assignRoleController = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const { userId, roleId, tenantId, branchId } = req.body;

  const userRole = await UserRole.create({
    userId,
    roleId,
    tenantId,
    branchId
  });

  // Invalidate cache
  await RBACService.invalidateUserCache(userId);

  // Audit Log
  await PermissionAudit.create({
    tenantId,
    action: PermissionAuditAction.ROLE_ASSIGNED,
    performedBy: adminId,
    targetUserId: userId,
    details: { roleId, branchId }
  });

  res.status(201).json({ success: true, message: 'Role Assigned', data: userRole });
});
