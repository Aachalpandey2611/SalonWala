import { Router } from 'express';
import { 
  createAppointment, updateAppointment, 
  getAppointment, searchAppointments, deleteAppointment 
} from '../controllers/booking.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { bookingSchemas } from '../validators/booking.validator';

const router = Router();

// All booking operations require authentication
router.use(requireAuth);

router.post('/', validate(bookingSchemas.createAppointment), createAppointment);
router.get('/search', validate(bookingSchemas.searchAppointments), searchAppointments);

router.get('/:id', getAppointment);
router.patch('/:id', validate(bookingSchemas.updateAppointment), updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
