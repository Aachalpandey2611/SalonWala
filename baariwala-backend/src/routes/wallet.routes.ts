import { Router } from 'express';
import { 
  getWalletController,
  getWalletTransactionsController,
  rechargeWalletController,
  payUsingWalletController
} from '../controllers/wallet.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { walletSchemas } from '../validators/wallet.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);
router.use(requireRole(UserRole.CUSTOMER));

router.get('/', getWalletController);
router.get('/transactions', getWalletTransactionsController);
router.post('/recharge', validate(walletSchemas.rechargeWallet), rechargeWalletController);
router.post('/pay', validate(walletSchemas.payUsingWallet), payUsingWalletController);

export default router;
