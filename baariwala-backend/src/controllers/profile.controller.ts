import { Request, Response } from 'express';
import { CustomerProfile } from '../models/CustomerProfile';
import { BarberProfile } from '../models/BarberProfile';
import { OwnerProfile } from '../models/OwnerProfile';
import { UserRole } from '../constants/roles';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { calculateCustomerCompletion } from '../services/profile.service';
import cloudinary from '../config/cloudinary';
import { User } from '../models/User';

const getModelByRole = (role: UserRole) => {
  if (role === UserRole.BARBER) return BarberProfile;
  if (role === UserRole.SALON_OWNER) return OwnerProfile;
  return CustomerProfile;
};

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const role = req.user!.role;
  const Model = getModelByRole(role);

  const AnyModel = Model as any;
  let profile = await AnyModel.findOne({ user: req.user!.id });
  
  if (!profile) {
    // Auto-create empty profile if it doesn't exist yet
    profile = await AnyModel.create({ user: req.user!.id });
  }

  res.status(200).json({ success: true, data: profile });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const role = req.user!.role;
  const Model = getModelByRole(role);

  const AnyModel = Model as any;
  const profile: any = await AnyModel.findOne({ user: req.user!.id });
  if (!profile) throw new AppError('Profile not found', 404);

  // Update fields
  Object.assign(profile, req.body);
  
  const user = await User.findById(req.user!.id);
  const hasAvatar = !!(user && user.avatar);

  // Recalculate completion based on role
  if (role === UserRole.CUSTOMER || role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    profile.completionPercentage = calculateCustomerCompletion(profile, hasAvatar);
  }

  await profile.save();

  res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
});

export const uploadPhoto = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError('No image uploaded', 400);

  const user = await User.findById(req.user!.id);
  if (!user) throw new AppError('User not found', 404);

  // Delete old avatar from Cloudinary if it exists
  if (user.avatar && user.avatar.includes('cloudinary')) {
    const urlParts = user.avatar.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `SalonWala/profiles/${publicIdWithExt.split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId).catch(() => console.log('Old image delete failed silently'));
  }

  user.avatar = req.file.path; // Cloudinary URL
  await user.save({ validateModifiedOnly: true });

  // Update profile completion % since avatar changed
  const Model = getModelByRole(req.user!.role);
  const AnyModel = Model as any;
  const profile: any = await AnyModel.findOne({ user: req.user!.id });
  if (profile && req.user!.role === UserRole.CUSTOMER) {
    profile.completionPercentage = calculateCustomerCompletion(profile, true);
    await profile.save();
  }

  res.status(200).json({ success: true, message: 'Photo uploaded successfully', data: { avatar: user.avatar } });
});

export const deletePhoto = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user || !user.avatar) throw new AppError('No avatar to delete', 400);

  if (user.avatar.includes('cloudinary')) {
    const urlParts = user.avatar.split('/');
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = `SalonWala/profiles/${publicIdWithExt.split('.')[0]}`;
    await cloudinary.uploader.destroy(publicId);
  }

  user.avatar = undefined;
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({ success: true, message: 'Photo deleted successfully' });
});

// Addresses (Customer Only)
export const addAddress = catchAsync(async (req: Request, res: Response) => {
  if (req.user!.role !== UserRole.CUSTOMER) throw new AppError('Only customers can have addresses', 403);

  const profile = await CustomerProfile.findOne({ user: req.user!.id });
  if (!profile) throw new AppError('Profile not found', 404);

  if (req.body.isDefault) {
    profile.addresses.forEach(addr => addr.isDefault = false);
  }

  profile.addresses.push(req.body);
  profile.completionPercentage = calculateCustomerCompletion(profile, true);
  await profile.save();

  res.status(201).json({ success: true, message: 'Address added', data: profile.addresses });
});

export const updateAddress = catchAsync(async (req: Request, res: Response) => {
  if (req.user!.role !== UserRole.CUSTOMER) throw new AppError('Forbidden', 403);
  
  const profile = await CustomerProfile.findOne({ user: req.user!.id });
  if (!profile) throw new AppError('Profile not found', 404);

  const address = (profile.addresses as any).id(req.params.addressId);
  if (!address) throw new AppError('Address not found', 404);

  if (req.body.isDefault) {
    profile.addresses.forEach(addr => addr.isDefault = false);
  }

  Object.assign(address, req.body);
  await profile.save();

  res.status(200).json({ success: true, message: 'Address updated', data: profile.addresses });
});

export const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  if (req.user!.role !== UserRole.CUSTOMER) throw new AppError('Forbidden', 403);

  const profile = await CustomerProfile.findOne({ user: req.user!.id });
  if (!profile) throw new AppError('Profile not found', 404);

  (profile.addresses as any).pull({ _id: req.params.addressId });
  await profile.save();

  res.status(200).json({ success: true, message: 'Address deleted', data: profile.addresses });
});
