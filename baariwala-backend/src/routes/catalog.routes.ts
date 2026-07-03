import { Router } from 'express';
import { 
  createCategory, getCategories, updateCategory,
  createService, getServices, updateService,
  createAddon, calculateServiceTotal
} from '../controllers/catalog.controller';
import { 
  createPricingOverride, getPricingOverrides,
  createTax, getTaxes,
  createDiscount, getDiscounts
} from '../controllers/pricing.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { catalogSchemas } from '../validators/catalog.validator';
import { UserRole } from '../constants/roles';

const router = Router();

// ==========================================
// PUBLIC READ-ONLY ROUTES (Search/Filter)
// ==========================================
router.get('/categories', getCategories);
router.get('/services', getServices);
router.post('/calculate', validate(catalogSchemas.calculateTotal), calculateServiceTotal);

// ==========================================
// PROTECTED ROUTES (Owner/Admin)
// ==========================================
router.use(requireAuth);
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Categories
router.post('/categories', validate(catalogSchemas.createCategory), createCategory);
router.patch('/categories/:id', validate(catalogSchemas.updateCategory), updateCategory);

// Services
router.post('/services', validate(catalogSchemas.createService), createService);
router.patch('/services/:id', updateService); // Use partial validation if needed

// Add-ons
router.post('/services/:parentServiceId/addons', validate(catalogSchemas.createAddon), createAddon);

// Pricing Overrides
router.post('/services/:serviceId/pricing', validate(catalogSchemas.createPricing), createPricingOverride);
router.get('/services/:serviceId/pricing', getPricingOverrides);

// Taxes
router.post('/taxes', validate(catalogSchemas.createTax), createTax);
router.get('/taxes', getTaxes); // Might need salonId query param

// Discounts
router.post('/discounts', validate(catalogSchemas.createDiscount), createDiscount);
router.get('/discounts', getDiscounts);

export default router;
