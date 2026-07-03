import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadPhoto, 
  deletePhoto,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/profile.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { uploadAvatar } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import { profileSchemas } from '../validators/profile.validator';

const router = Router();

// All profile routes require authentication
router.use(requireAuth);

router.get('/', getProfile);

// For simplicity, we just use one update route. In a strict system, you might branch by role
// router.patch('/', validate(profileSchemas.updateCustomerProfile), updateProfile); // Uncomment to strictly validate customer body
router.patch('/', updateProfile); 

router.post('/photo', uploadAvatar.single('avatar'), uploadPhoto);
router.delete('/photo', deletePhoto);

// Address Management (Customer)
router.post('/addresses', validate(profileSchemas.addAddress), addAddress);
router.patch('/addresses/:addressId', validate(profileSchemas.updateAddress), updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

export default router;
