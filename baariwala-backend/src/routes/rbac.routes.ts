import { Router } from 'express';
import { 
  getMyPermissionsController,
  assignRoleController
} from '../controllers/rbac.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { rbacSchemas } from '../validators/rbac.validator';

const router = Router();

router.use(requireAuth);

// Frontend accesses this to render Sidebar/Buttons
router.get('/me/permissions', getMyPermissionsController);

// Only admins with explicit role-assignment permission can assign roles
router.post('/assign', requirePermission('iam.role.assign'), validate(rbacSchemas.assignRole), assignRoleController);

export default router;
