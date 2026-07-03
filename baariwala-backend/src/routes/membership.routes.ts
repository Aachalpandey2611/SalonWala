import { Router } from 'express';
import { 
  getPlansController,
  getMyMembershipController,
  purchaseMembershipController,
  upgradeMembershipController,
  cancelAutoRenewController
} from '../controllers/membership.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { membershipSchemas } from '../validators/membership.validator';
import { UserRole } from '../constants/roles';

const router = Router();

// Public / Semi-public
router.get('/plans', getPlansController);

// Authenticated Customer Routes
router.use(requireAuth);
router.use(requireRole(UserRole.CUSTOMER));

router.get('/my', getMyMembershipController);
router.post('/purchase', validate(membershipSchemas.purchaseMembership), purchaseMembershipController);
router.post('/upgrade', validate(membershipSchemas.upgradeMembership), upgradeMembershipController);
router.post('/cancel', cancelAutoRenewController);

export default router;
