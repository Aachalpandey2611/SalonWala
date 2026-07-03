import { Router } from 'express';
import { generateSlots, checkAvailability } from '../controllers/availability.controller';
import { 
  setWorkingHours, createShift, 
  createBreak, requestLeave, updateLeaveStatus, 
  createException 
} from '../controllers/availability-admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { availabilitySchemas } from '../validators/availability.validator';
import { UserRole } from '../constants/roles';

const router = Router();

// ==========================================
// SCHEDULING ENGINE (Public / Customers)
// ==========================================
router.get('/slots', validate(availabilitySchemas.generateSlots), generateSlots);
router.get('/check', validate(availabilitySchemas.checkAvailability), checkAvailability);

// ==========================================
// ADMIN & BARBER ROUTES
// ==========================================
router.use(requireAuth);

// Barbers can request leaves and breaks
router.post(
  '/:barberId/breaks', 
  requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BARBER),
  validate(availabilitySchemas.createBreak), 
  createBreak
);

router.post(
  '/:barberId/leaves', 
  requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BARBER),
  validate(availabilitySchemas.requestLeave), 
  requestLeave
);

// Only Salon Owners / Admins can manage the core schedule
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.post('/:barberId/hours', validate(availabilitySchemas.setWorkingHours), setWorkingHours);
router.post('/:barberId/shifts', validate(availabilitySchemas.createShift), createShift);
router.post('/:barberId/exceptions', validate(availabilitySchemas.createException), createException);

router.patch('/leaves/:id/status', validate(availabilitySchemas.updateLeaveStatus), updateLeaveStatus);

export default router;
