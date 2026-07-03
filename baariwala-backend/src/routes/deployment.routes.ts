import { Router } from 'express';
import { 
  getDeploymentHistoryController,
  getReleasesController,
  logDeploymentWebhookController
} from '../controllers/deployment.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';

const router = Router();

// Webhook endpoint (Secure this with a secret token in production)
router.post('/webhook', logDeploymentWebhookController);

router.use(requireAuth);
router.get('/history', requirePermission('deployment.read.global'), getDeploymentHistoryController);
router.get('/releases', requirePermission('deployment.read.global'), getReleasesController);

export default router;
