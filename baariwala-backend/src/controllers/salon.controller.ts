import { Request, Response } from 'express';
import { Salon, SalonStatus } from '../models/Salon';
import { SalonBranch } from '../models/SalonBranch';
import { BusinessHours } from '../models/BusinessHours';
import { Holiday } from '../models/Holiday';
import { SalonGallery } from '../models/SalonGallery';
import { SalonAmenities } from '../models/SalonAmenities';
import { SalonPolicies } from '../models/SalonPolicies';
import { BusinessVerification, VerificationDocStatus } from '../models/BusinessVerification';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

// Helper to verify ownership
const verifySalonOwnership = async (salonId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return; // Super admin can manage all
  
  const salon = await Salon.findById(salonId);
  if (!salon) throw new AppError('Salon not found', 404);
  
  if (salon.ownerId.toString() !== userId && role !== UserRole.ADMIN) {
    throw new AppError('You do not have permission to manage this salon', 403);
  }
};

const verifyBranchOwnership = async (branchId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const branch = await SalonBranch.findById(branchId);
  if (!branch) throw new AppError('Branch not found', 404);
  await verifySalonOwnership(branch.salonId.toString(), userId, role);
  return branch;
};

// Salon CRUD
export const createSalon = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const salon = await Salon.create({ name, ownerId: req.user!.id });
  res.status(201).json({ success: true, data: salon });
});

export const getSalons = catchAsync(async (req: Request, res: Response) => {
  // If owner, return their salons. If admin, return all.
  const query = (req.user!.role === UserRole.SALON_OWNER) ? { ownerId: req.user!.id } : {};
  const salons = await Salon.find(query);
  res.status(200).json({ success: true, data: salons });
});

export const getSalon = catchAsync(async (req: Request, res: Response) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) throw new AppError('Salon not found', 404);
  res.status(200).json({ success: true, data: salon });
});

// Branch CRUD
export const createBranch = catchAsync(async (req: Request, res: Response) => {
  const salonId = req.params.salonId as string;
  await verifySalonOwnership(salonId, req.user!.id, req.user!.role);

  const { name, branchCode, phone, email, coordinates, address, city, state, country, pincode, timezone } = req.body;

  // Prevent duplicate branch code
  const existingCode = await SalonBranch.findOne({ branchCode });
  if (existingCode) throw new AppError('Branch code already exists', 400);

  const branch = await SalonBranch.create({
    salonId, name, branchCode, phone, email,
    location: { type: 'Point', coordinates: coordinates as [number, number] },
    address, city, state, country, pincode, timezone
  });

  // Auto-initialize amenities and policies
  await SalonAmenities.create({ branchId: branch._id });
  await SalonPolicies.create({ branchId: branch._id });

  res.status(201).json({ success: true, data: branch });
});

export const updateBranchStatus = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.params.branchId as string;
  const branch = await verifyBranchOwnership(branchId, req.user!.id, req.user!.role);
  branch!.status = req.body.status;
  await branch!.save();
  res.status(200).json({ success: true, data: branch });
});

// Business Hours
export const updateBusinessHours = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.params.branchId as string;
  await verifyBranchOwnership(branchId, req.user!.id, req.user!.role);
  const { day, isClosed, sessions } = req.body;

  const hours = await BusinessHours.findOneAndUpdate(
    { branchId, day },
    { isClosed, sessions },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, data: hours });
});

// Holidays & Emergency Closure
export const createHoliday = catchAsync(async (req: Request, res: Response) => {
  const { salonId, branchId, type, emergencyReason, reason, date, isRecurring } = req.body;
  await verifySalonOwnership(salonId, req.user!.id, req.user!.role);

  if (branchId) {
    const branch = await SalonBranch.findById(branchId);
    if (!branch || branch.salonId.toString() !== salonId) throw new AppError('Invalid branch for this salon', 400);
  }

  const holiday = await Holiday.create({
    salonId, branchId, type, emergencyReason, reason, date, isRecurring
  });

  res.status(201).json({ success: true, data: holiday });
});

// Amenities & Policies
export const updateAmenities = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.params.branchId as string;
  await verifyBranchOwnership(branchId, req.user!.id, req.user!.role);
  
  const amenities = await SalonAmenities.findOneAndUpdate(
    { branchId },
    req.body,
    { new: true, upsert: true }
  );
  res.status(200).json({ success: true, data: amenities });
});

export const updatePolicies = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.params.branchId as string;
  await verifyBranchOwnership(branchId, req.user!.id, req.user!.role);
  
  const policies = await SalonPolicies.findOneAndUpdate(
    { branchId },
    req.body,
    { new: true, upsert: true }
  );
  res.status(200).json({ success: true, data: policies });
});

// Gallery & Verification (Media Uploads)
// Uses existing upload middleware on the router. req.files contains the uploaded items.
export const uploadGalleryImages = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.params.branchId as string;
  await verifyBranchOwnership(branchId, req.user!.id, req.user!.role);
  const { type } = req.body;

  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new AppError('No images uploaded', 400);
  }

  const images = (req.files as Express.Multer.File[]).map(file => ({
    url: file.path,
    publicId: file.filename // Cloudinary specific
  }));

  const gallery = await SalonGallery.findOneAndUpdate(
    { branchId, type },
    { $push: { images: { $each: images } } },
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, data: gallery });
});

export const uploadVerificationDocs = catchAsync(async (req: Request, res: Response) => {
  const salonId = req.params.salonId as string;
  await verifySalonOwnership(salonId, req.user!.id, req.user!.role);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files) throw new AppError('No documents uploaded', 400);

  const payload: any = {};
  if (files['gstDocument']) payload.gstDocumentUrl = files['gstDocument'][0].path;
  if (files['registrationDocument']) payload.registrationDocumentUrl = files['registrationDocument'][0].path;
  if (files['addressProof']) payload.addressProofUrl = files['addressProof'][0].path;
  if (files['identityProof']) payload.identityProofUrl = files['identityProof'][0].path;

  // Set pending status when new docs are uploaded
  payload.status = VerificationDocStatus.PENDING;

  const verification = await BusinessVerification.findOneAndUpdate(
    { salonId },
    payload,
    { new: true, upsert: true }
  );

  res.status(200).json({ success: true, data: verification });
});
