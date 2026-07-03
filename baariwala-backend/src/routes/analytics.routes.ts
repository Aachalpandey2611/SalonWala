import { Router } from 'express';
import { 
  getRevenueAnalyticsController,
  getBookingAnalyticsController,
  getCustomerAnalyticsController,
  getLiveDashboardController
} from '../controllers/analytics.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { analyticsSchemas } from '../validators/analytics.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);
// Most analytics restricted to management
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/revenue', validate(analyticsSchemas.getDateRange), getRevenueAnalyticsController);
router.get('/bookings', validate(analyticsSchemas.getDateRange), getBookingAnalyticsController);
router.get('/customers', getCustomerAnalyticsController);
router.get('/dashboard/live', validate(analyticsSchemas.getDateRange), getLiveDashboardController);

export default router;
