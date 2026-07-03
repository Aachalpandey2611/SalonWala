import { Router } from 'express';
import { 
  createBarber, updateBarber, getBarberDetails, searchBarbers, assignBranch 
} from '../controllers/barber.controller';
import { 
  assignSkill, getBarberSkills, 
  uploadCertification, getBarberCertifications,
  uploadPortfolioImage, getBarberPortfolio 
} from '../controllers/barber-assets.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { barberSchemas } from '../validators/barber.validator';
import { uploadAvatar } from '../middlewares/upload.middleware';
import { UserRole } from '../constants/roles';

const router = Router();

// ==========================================
// PUBLIC READ-ONLY ROUTES (Search)
// ==========================================
router.get('/search', searchBarbers);
router.get('/:id', getBarberDetails);
router.get('/:barberId/skills', getBarberSkills);
router.get('/:barberId/certifications', getBarberCertifications);
router.get('/:barberId/portfolio', getBarberPortfolio);

// ==========================================
// PROTECTED ROUTES (Owner/Admin/Barber)
// ==========================================
router.use(requireAuth);
// Let the controllers handle granular access (Barber can only edit self)
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.BARBER));

// Core Profile
router.post('/', validate(barberSchemas.createBarber), createBarber);
router.patch('/:id', validate(barberSchemas.updateBarber), updateBarber);

// Branch Assignments
router.post('/:barberId/branches', validate(barberSchemas.assignBranch), assignBranch);

// Skills
router.post('/:barberId/skills', validate(barberSchemas.assignSkill), assignSkill);

// Media Assets
router.post(
  '/:barberId/certifications', 
  uploadAvatar.array('image', 1), 
  validate(barberSchemas.uploadCertification), 
  uploadCertification
);

router.post(
  '/:barberId/portfolio', 
  uploadAvatar.array('images', 10), 
  validate(barberSchemas.uploadPortfolio), 
  uploadPortfolioImage
);

export default router;
