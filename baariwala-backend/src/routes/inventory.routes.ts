import { Router } from 'express';
import { 
  createProductController,
  getProductsController,
  getInventoryController,
  adjustStockController
} from '../controllers/inventory.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { inventorySchemas } from '../validators/inventory.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

router.get('/products', getProductsController);
router.post('/products', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN), validate(inventorySchemas.createProduct), createProductController);

router.get('/', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALON_OWNER), getInventoryController);
router.post('/:inventoryId/adjust', requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALON_OWNER), validate(inventorySchemas.adjustStock), adjustStockController);

export default router;
