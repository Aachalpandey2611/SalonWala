import { Router } from 'express';
import { 
  requestReportController,
  getReportStatusController,
  downloadReportController
} from '../controllers/report.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { reportSchemas } from '../validators/report.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);
// Restrict report generation to Managers and above
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.post('/generate', validate(reportSchemas.requestReport), requestReportController);
router.get('/:id/status', getReportStatusController);
router.get('/:id/download', downloadReportController);

export default router;
