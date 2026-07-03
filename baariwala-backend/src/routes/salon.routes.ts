import { Router } from 'express';
import { 
  createSalon, getSalons, getSalon,
  createBranch, updateBranchStatus,
  updateBusinessHours, createHoliday,
  updateAmenities, updatePolicies,
  uploadGalleryImages, uploadVerificationDocs
} from '../controllers/salon.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { salonSchemas } from '../validators/salon.validator';
import { uploadAvatar } from '../middlewares/upload.middleware'; // Re-using existing Cloudinary config
import { UserRole } from '../constants/roles';

const router = Router();

// All salon routes require authentication and at least SalonOwner role (except maybe GET, but for now we lock it)
router.use(requireAuth);
router.use(requireRole(UserRole.SALON_OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Salon Core
router.post('/', validate(salonSchemas.createSalon), createSalon);
router.get('/', getSalons);
router.get('/:id', getSalon);

// Salon Branches
router.post('/:salonId/branches', validate(salonSchemas.createBranch), createBranch);
router.patch('/branches/:branchId/status', validate(salonSchemas.updateBranchStatus), updateBranchStatus);

// Business Hours & Holidays
router.patch('/branches/:branchId/hours', validate(salonSchemas.updateHours), updateBusinessHours);
router.post('/holidays', validate(salonSchemas.createHoliday), createHoliday);

// Amenities & Policies
router.patch('/branches/:branchId/amenities', validate(salonSchemas.updateAmenities), updateAmenities);
router.patch('/branches/:branchId/policies', validate(salonSchemas.updatePolicies), updatePolicies);

// Gallery & Verification (Media)
router.post(
  '/branches/:branchId/gallery', 
  uploadAvatar.array('images', 10), 
  validate(salonSchemas.uploadGallery), 
  uploadGalleryImages
);

router.post(
  '/:salonId/verification',
  uploadAvatar.fields([
    { name: 'gstDocument', maxCount: 1 },
    { name: 'registrationDocument', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'identityProof', maxCount: 1 }
  ]),
  uploadVerificationDocs
);

export default router;
