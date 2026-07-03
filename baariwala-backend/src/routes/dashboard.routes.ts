import { Router } from 'express';
import { 
  getMyDashboardController,
  savePreferencesController
} from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { dashboardSchemas } from '../validators/dashboard.validator';

const router = Router();

router.use(requireAuth);

router.get('/me', getMyDashboardController);
router.put('/preferences', validate(dashboardSchemas.savePreferences), savePreferencesController);

export default router;
