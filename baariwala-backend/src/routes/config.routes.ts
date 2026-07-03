import { Router } from 'express';
import { 
  createOrUpdateSettingController,
  resolveSettingController,
  checkFeatureFlagController
} from '../controllers/config.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { configSchemas } from '../validators/config.validator';

const router = Router();

router.use(requireAuth);

router.post('/settings', requirePermission('config.update.tenant'), validate(configSchemas.createSetting), createOrUpdateSettingController);

router.get('/settings/:key/resolve', resolveSettingController);
router.get('/flags/:key/check', checkFeatureFlagController);

export default router;
