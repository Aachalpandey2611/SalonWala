import { Router } from 'express';
import { 
  getBackupDashboardController,
  triggerBackupController,
  triggerRestoreController
} from '../controllers/backup.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { backupSchemas } from '../validators/backup.validator';

const router = Router();

// Strict security: Only global backup admins can access these
router.use(requireAuth);

router.get('/dashboard', requirePermission('backup.read.global'), getBackupDashboardController);
router.post('/trigger', requirePermission('backup.write.global'), validate(backupSchemas.triggerBackup), triggerBackupController);
router.post('/restore', requirePermission('backup.restore.global'), validate(backupSchemas.triggerRestore), triggerRestoreController);

export default router;
