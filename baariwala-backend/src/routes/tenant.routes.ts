import { Router } from 'express';
import { 
  createTenantController,
  getMyTenantConfigController,
  suspendTenantController
} from '../controllers/tenant.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { tenantSchemas } from '../validators/tenant.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

// Tenant-wide config retrieval (allowed for standard users belonging to the tenant)
router.get('/config/me', getMyTenantConfigController);

// SuperAdmin Only Routes
router.post('/', requireRole(UserRole.SUPER_ADMIN), validate(tenantSchemas.createTenant), createTenantController);
router.put('/:id/suspend', requireRole(UserRole.SUPER_ADMIN), suspendTenantController);

export default router;
