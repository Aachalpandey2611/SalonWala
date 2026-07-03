import { Router } from 'express';
import { 
  getRevenueForecastController,
  getRecommendationsController,
  actionRecommendationController
} from '../controllers/forecast.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { forecastSchemas } from '../validators/forecast.validator';
import { UserRole } from '../constants/roles';

const router = Router();

// Forecasting is strictly for Management
router.use(requireAuth);
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/revenue', getRevenueForecastController);
router.get('/recommendations', getRecommendationsController);
router.post('/recommendations/:id/action', validate(forecastSchemas.actionRecommendation), actionRecommendationController);

export default router;
