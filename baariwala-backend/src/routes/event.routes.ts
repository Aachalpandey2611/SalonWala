import { Router } from 'express';
import { 
  publishEventController, 
  getEventsController, 
  getPendingEventsController, 
  getDeadLetterQueueController, 
  replayDeadLetterController, 
  processRetryQueueController 
} from '../controllers/event.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { eventSchemas } from '../validators/event.validator';

const router = Router();

router.use(requireAuth);

router.post('/publish', validate(eventSchemas.publishEvent), publishEventController);
router.get('/', getEventsController);
router.get('/pending', getPendingEventsController);
router.get('/dlq', getDeadLetterQueueController);
router.post('/dlq/:id/replay', replayDeadLetterController);
router.post('/process-retries', processRetryQueueController); // Manual trigger endpoint

export default router;
