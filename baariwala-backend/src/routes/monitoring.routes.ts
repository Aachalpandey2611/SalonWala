import { Router } from 'express';
import { 
  getHealthDashboardController,
  resolveAlertController
} from '../controllers/monitoring.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { monitoringSchemas } from '../validators/monitoring.validator';

const router = Router();

// Only SuperAdmins can view Global Monitoring Dashboard
router.use(requireAuth);
router.use(requirePermission('monitoring.read.global'));

router.get('/dashboard', getHealthDashboardController);
router.put('/alerts/:id/resolve', validate(monitoringSchemas.resolveAlert), resolveAlertController);

export default router;
