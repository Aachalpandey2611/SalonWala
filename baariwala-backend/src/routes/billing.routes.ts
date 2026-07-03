import { Router } from 'express';
import { 
  generateInvoiceController,
  getInvoiceController,
  getInvoicesController,
  downloadInvoicePdfController
} from '../controllers/billing.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { billingSchemas } from '../validators/billing.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

router.post('/generate', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALON_OWNER), validate(billingSchemas.generateInvoice), generateInvoiceController);
router.get('/', getInvoicesController);
router.get('/:invoiceId', getInvoiceController);
router.get('/:invoiceId/pdf', downloadInvoicePdfController);

export default router;
