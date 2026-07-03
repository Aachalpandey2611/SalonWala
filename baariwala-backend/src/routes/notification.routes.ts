import { Router } from 'express';
import { 
  getNotificationsController, 
  markAsReadController, 
  markAllAsReadController, 
  getPreferencesController, 
  updatePreferencesController 
} from '../controllers/notification.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { notificationSchemas } from '../validators/notification.validator';

const router = Router();

router.use(requireAuth);

router.get('/', getNotificationsController);
router.patch('/read-all', markAllAsReadController);
router.patch('/:id/read', markAsReadController);

router.get('/preferences', getPreferencesController);
router.patch('/preferences', validate(notificationSchemas.updatePreferences), updatePreferencesController);

export default router;
