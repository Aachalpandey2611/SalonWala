import { Router } from 'express';
import { 
  getVersionsController,
  getChangelogController,
  updateClientCompatController
} from '../controllers/version.controller';
import { requireAuth, requirePermission } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { versionSchemas } from '../validators/version.validator';

const router = Router();

router.get('/registry', getVersionsController);
router.get('/changelog', getChangelogController);

// SuperAdmin operations
router.use(requireAuth);
router.put('/client-compat', requirePermission('version.write.global'), validate(versionSchemas.updateCompat), updateClientCompatController);

export default router;
