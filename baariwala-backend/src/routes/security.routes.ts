import { Router } from 'express';
import { 
  getActiveSessionsController,
  blockIpController,
  getThreatDashboardController
} from '../controllers/security.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { securitySchemas } from '../validators/security.validator';

const router = Router();

router.use(requireAuth);

router.get('/sessions', getActiveSessionsController);

router.post('/block-ip', requirePermission('security.write.global'), validate(securitySchemas.blockIp), blockIpController);
router.get('/dashboard', requirePermission('security.read.global'), getThreatDashboardController);

export default router;
