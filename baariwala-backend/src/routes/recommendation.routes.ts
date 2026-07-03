import { Router } from 'express';
import { 
  recommendBarberController, 
  recommendServiceController, 
  recommendSlotController, 
  recommendRecoveryController 
} from '../controllers/recommendation.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { recommendationSchemas } from '../validators/recommendation.validator';

const router = Router();

router.use(requireAuth);

router.get('/barbers', validate(recommendationSchemas.recommendBarber), recommendBarberController);
router.get('/services', validate(recommendationSchemas.recommendService), recommendServiceController);
router.get('/slots', validate(recommendationSchemas.recommendSlot), recommendSlotController);
router.get('/recovery', validate(recommendationSchemas.recommendRecovery), recommendRecoveryController);

export default router;
