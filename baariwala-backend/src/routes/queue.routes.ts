import { Router } from 'express';
import { 
  joinQueueController, getLiveQueueController, 
  recalculateQueueController, updateQueueEntryStatusController 
} from '../controllers/queue.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { queueSchemas } from '../validators/queue.validator';

const router = Router();

router.use(requireAuth);

router.post('/join', validate(queueSchemas.joinQueue), joinQueueController);
router.get('/live', getLiveQueueController);
router.post('/recalculate', recalculateQueueController);
router.patch('/:id/status', updateQueueEntryStatusController);

export default router;
