import { Router } from 'express';
import { 
  createCycleController,
  getCyclesController,
  generatePayrollController,
  approveCycleController,
  getPayrollsController,
  adjustPayrollController,
  generatePayslipController
} from '../controllers/payroll.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { payrollSchemas } from '../validators/payroll.validator';
import { UserRole } from '../constants/roles';

const router = Router();

router.use(requireAuth);

// Cycle Management (Owner / Admin)
router.post('/cycles', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(payrollSchemas.createCycle), createCycleController);
router.get('/cycles', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), getCyclesController);

router.post('/cycles/:id/generate', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(payrollSchemas.generatePayroll), generatePayrollController);
router.post('/cycles/:id/approve', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), approveCycleController);

// Payroll Operations
router.get('/', getPayrollsController); // All roles (filtered natively)
router.post('/:id/adjust', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), validate(payrollSchemas.adjustPayroll), adjustPayrollController);
router.post('/:id/payslip', requireRole(UserRole.SALON_OWNER, UserRole.ADMIN), generatePayslipController);

export default router;
