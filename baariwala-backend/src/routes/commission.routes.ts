import { Router } from 'express';
import { 
  getCommissionsController,
  getCommissionSummaryController,
  changeStatusController,
  adjustCommissionController,
  bulkApproveController,
  createRuleController,
  getRulesController,
  getCommissionHistoryController
} from '../controllers/commission.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { commissionSchemas } from '../validators/commission.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

// Everyone (except customers) can view summary and list
router.get('/', getCommissionsController);
router.get('/summary', getCommissionSummaryController);
router.get('/:id/history', getCommissionHistoryController);

// Manager, Admin, Salon Owner Routes for Operations
router.post('/bulk-approve', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), bulkApproveController);

router.post('/:id/status', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(commissionSchemas.changeStatus), changeStatusController);
router.post('/:id/adjust', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(commissionSchemas.adjustCommission), adjustCommissionController);

// Rules management (Salon Owners / Admins only)
router.post('/rules', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(commissionSchemas.createRule), createRuleController);
router.get('/rules', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getRulesController);

export default router;
