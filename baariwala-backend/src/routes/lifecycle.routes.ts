import { Router } from 'express';
import { 
  confirmBookingController, checkInController, assignBarberController, 
  startServiceController, completeServiceController, cancelBookingController, 
  markNoShowController, expireBookingController 
} from '../controllers/lifecycle.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { lifecycleSchemas } from '../validators/lifecycle.validator';

const router = Router();

router.use(requireAuth);

router.post('/:id/confirm', confirmBookingController);
router.post('/:id/check-in', validate(lifecycleSchemas.checkIn), checkInController);
router.post('/:id/assign', validate(lifecycleSchemas.assignBarber), assignBarberController);
router.post('/:id/start', startServiceController);
router.post('/:id/complete', validate(lifecycleSchemas.completeService), completeServiceController);
router.post('/:id/cancel', validate(lifecycleSchemas.cancelBooking), cancelBookingController);
router.post('/:id/no-show', markNoShowController);
router.post('/:id/expire', expireBookingController);

export default router;
