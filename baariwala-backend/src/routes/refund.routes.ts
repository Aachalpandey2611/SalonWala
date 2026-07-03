import { Router } from 'express';
import { 
  getRefundRequestsController,
  getRefundsController,
  processRefundController,
  generateSettlementController,
  getSettlementsController
} from '../controllers/refund.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { refundSchemas } from '../validators/refund.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

router.get('/requests', getRefundRequestsController);
router.get('/', getRefundsController);
router.post('/requests/:refundRequestId/process', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(refundSchemas.processRefund), processRefundController);

router.post('/settlements/generate', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(refundSchemas.generateSettlement), generateSettlementController);
router.get('/settlements', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALON_OWNER), getSettlementsController);

export default router;
