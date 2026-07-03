import { Router } from 'express';
import { 
  createShiftController,
  getShiftsController,
  assignShiftController,
  checkInController,
  checkOutController,
  getAttendanceController,
  applyLeaveController,
  approveLeaveController,
  getLeaveRequestsController,
  getLeaveBalanceController
} from '../controllers/attendance.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { attendanceSchemas } from '../validators/attendance.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

/**
 * SHIFT ROUTES
 */
router.post('/shifts', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(attendanceSchemas.createShift), createShiftController);
router.get('/shifts', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getShiftsController);
router.post('/shifts/assign', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(attendanceSchemas.assignShift), assignShiftController);

/**
 * ATTENDANCE ROUTES
 */
router.post('/check-in', validate(attendanceSchemas.checkIn), checkInController);
router.post('/check-out', validate(attendanceSchemas.checkOut), checkOutController);
router.get('/', getAttendanceController);

/**
 * LEAVE ROUTES
 */
router.post('/leave', validate(attendanceSchemas.applyLeave), applyLeaveController);
router.get('/leave', getLeaveRequestsController);
router.get('/leave/balance', getLeaveBalanceController);
router.post('/leave/:id/approve', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), approveLeaveController);

export default router;
