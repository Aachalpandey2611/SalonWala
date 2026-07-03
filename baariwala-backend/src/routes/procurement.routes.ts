import { Router } from 'express';
import { 
  createSupplierController,
  getSuppliersController,
  changeSupplierStatusController,
  createPOController,
  approvePOController,
  getPOsController,
  receiveGoodsController,
  getGRNsController
} from '../controllers/procurement.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { procurementSchemas } from '../validators/procurement.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

/**
 * SUPPLIER ROUTES
 */
router.post('/suppliers', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(procurementSchemas.createSupplier), createSupplierController);
router.get('/suppliers', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getSuppliersController);
router.patch('/suppliers/:id/status', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(procurementSchemas.changeSupplierStatus), changeSupplierStatusController);

/**
 * PURCHASE ORDER ROUTES
 */
router.post('/orders', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(procurementSchemas.createPO), createPOController);
router.get('/orders', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getPOsController);
router.post('/orders/:id/approve', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), approvePOController);

/**
 * GOODS RECEIPT ROUTES
 */
router.post('/orders/:id/receive', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(procurementSchemas.receiveGoods), receiveGoodsController);
router.get('/receipts', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getGRNsController);

export default router;
