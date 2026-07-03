import { Router } from 'express';
import { 
  getAuditLogsController,
  getSecurityEventsController
} from '../controllers/audit.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { auditSchemas } from '../validators/audit.validator';

const router = Router();

router.use(requireAuth);

router.get('/logs', requirePermission('audit.read.tenant'), validate(auditSchemas.getLogs), getAuditLogsController);
router.get('/security-events', requirePermission('audit.read.tenant'), getSecurityEventsController);

export default router;
