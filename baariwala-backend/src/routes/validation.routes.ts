import { Router } from 'express';
import { validateBookingController, validateWalkInController } from '../controllers/validation.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { validationSchemas } from '../validators/validation.validator';

const router = Router();

// Validation should generally be authenticated to prevent brute forcing available slots/barbers
router.use(requireAuth);

router.post('/booking', validate(validationSchemas.validateBooking), validateBookingController);
router.post('/walk-in', validate(validationSchemas.validateBooking), validateWalkInController);

export default router;
