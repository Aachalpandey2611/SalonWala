import { Router } from 'express';
import { 
  postManualAdjustmentController, 
  reverseJournalController, 
  getAccountBalanceController,
  getCustomerLedgerController,
  getSalonLedgerController,
  getLedgerHistoryController
} from '../controllers/ledger.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { ledgerSchemas } from '../validators/ledger.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

// Customer specific route
router.get('/customer', getCustomerLedgerController);

// Salon specific route
router.get('/salon/:salonId', getSalonLedgerController);

// Admin Routes for manual adjustments and reversals
router.post('/manual', requireRole(UserRole.SUPER_ADMIN), validate(ledgerSchemas.postManualTransaction), postManualAdjustmentController);
router.post('/:id/reverse', requireRole(UserRole.SUPER_ADMIN), validate(ledgerSchemas.reverseTransaction), reverseJournalController);

// General Querying (Admin/System)
router.get('/account/:accountId/balance', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN), getAccountBalanceController);
router.get('/account/:accountId/history', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN), getLedgerHistoryController);

export default router;
