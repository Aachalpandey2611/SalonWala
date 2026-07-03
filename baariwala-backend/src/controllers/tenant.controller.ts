import { Request, Response } from 'express';
import { TenantService } from '../services/tenant.service';
import { catchAsync } from '../utils/catchAsync';
import { Tenant, TenantStatus } from '../models/Tenant';
import { AppError } from '../utils/AppError';
import { OrganizationAudit, OrgAuditAction } from '../models/OrganizationAudit';

export const createTenantController = catchAsync(async (req: Request, res: Response) => {
  // SuperAdmin Only endpoint (verified by routes)
  const ownerId = req.user!.id; // Or passing in body
  const { tenantName, email, plan } = req.body;

  const tenant = await TenantService.createTenantPipeline(ownerId, tenantName, email, plan);

  res.status(201).json({ success: true, message: 'Tenant Provisioned', data: tenant });
});

export const getMyTenantConfigController = catchAsync(async (req: Request, res: Response) => {
  // Assuming auth middleware injects tenantId
  const tenantId = (req.user as any).tenantId; 
  if (!tenantId) throw new AppError('Tenant Isolation Error: Missing tenant ID on user token', 403);

  const config = await TenantService.getTenantConfiguration(tenantId);

  res.status(200).json({ success: true, data: config });
});

export const suspendTenantController = catchAsync(async (req: Request, res: Response) => {
  const tenantId = req.params.id as string;
  const adminId = req.user!.id;

  const tenant = await Tenant.findByIdAndUpdate(tenantId, { status: TenantStatus.SUSPENDED }, { new: true });
  if (!tenant) throw new AppError('Tenant not found', 404);

  await OrganizationAudit.create({
    tenantId,
    action: OrgAuditAction.TENANT_SUSPENDED,
    performedBy: adminId
  });

  // Future: EventBusService.publish('TenantSuspended', { tenantId }) -> kills all active sessions

  res.status(200).json({ success: true, message: 'Tenant Suspended', data: tenant });
});
