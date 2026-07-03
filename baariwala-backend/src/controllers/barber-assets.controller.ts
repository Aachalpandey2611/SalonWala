import { Request, Response } from 'express';
import { Barber } from '../models/Barber';
import { BarberSkill } from '../models/BarberSkill';
import { BarberCertification } from '../models/BarberCertification';
import { BarberPortfolio } from '../models/BarberPortfolio';
import { SalonService } from '../models/SalonService';
import { Salon } from '../models/Salon';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

// Verification guards (Re-used)
const verifySalonOwnership = async (salonId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const salon = await Salon.findById(salonId);
  if (!salon) throw new AppError('Salon not found', 404);
  if (salon.ownerId.toString() !== userId && role !== UserRole.ADMIN) {
    throw new AppError('You do not have permission', 403);
  }
};

const verifyBarberOwnership = async (barberId: string, userId: string, role: string) => {
  const barber = await Barber.findById(barberId);
  if (!barber) throw new AppError('Barber not found', 404);
  
  if (role === UserRole.SUPER_ADMIN) return barber;
  
  if (role === UserRole.BARBER) {
    if (barber.userId?.toString() !== userId) throw new AppError('You can only edit your own profile', 403);
    return barber;
  }
  
  await verifySalonOwnership(barber.salonId.toString(), userId, role);
  return barber;
};

// ==========================================
// SKILLS
// ==========================================
export const assignSkill = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const barber = await verifyBarberOwnership(barberId, req.user!.id, req.user!.role);
  
  // Verify service exists and belongs to the same salon
  const service = await SalonService.findById(req.body.serviceId);
  if (!service || service.salonId.toString() !== barber.salonId.toString()) {
    throw new AppError('Invalid service reference', 400);
  }

  const existing = await BarberSkill.findOne({ barberId, serviceId: req.body.serviceId });
  if (existing) throw new AppError('Barber already has this skill assigned', 400);

  const skill = await BarberSkill.create({
    barberId,
    salonId: barber.salonId,
    ...req.body
  });

  res.status(201).json({ success: true, data: skill });
});

export const getBarberSkills = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const skills = await BarberSkill.find({ barberId }).populate('serviceId', 'name categoryId durationInMinutes');
  res.status(200).json({ success: true, data: skills });
});

// ==========================================
// CERTIFICATIONS (Media Upload)
// ==========================================
export const uploadCertification = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const barber = await verifyBarberOwnership(barberId, req.user!.id, req.user!.role);
  
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new AppError('No certificate image uploaded', 400);
  }

  const file = (req.files as Express.Multer.File[])[0];

  const cert = await BarberCertification.create({
    barberId,
    salonId: barber.salonId,
    certificateName: req.body.certificateName,
    issuedBy: req.body.issuedBy,
    issueDate: req.body.issueDate,
    expiryDate: req.body.expiryDate,
    certificateImageUrl: file.path
  });

  res.status(201).json({ success: true, data: cert });
});

export const getBarberCertifications = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const certs = await BarberCertification.find({ barberId });
  res.status(200).json({ success: true, data: certs });
});

// ==========================================
// PORTFOLIO (Media Upload)
// ==========================================
export const uploadPortfolioImage = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const barber = await verifyBarberOwnership(barberId, req.user!.id, req.user!.role);
  
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    throw new AppError('No images uploaded', 400);
  }

  const files = req.files as Express.Multer.File[];
  const portfolioEntries = files.map((file, index) => ({
    barberId,
    salonId: barber.salonId,
    category: req.body.category || 'OTHER',
    caption: req.body.caption,
    displayOrder: req.body.displayOrder ? Number(req.body.displayOrder) + index : index,
    imageUrl: file.path,
    publicId: file.filename
  }));

  const created = await BarberPortfolio.insertMany(portfolioEntries);
  res.status(201).json({ success: true, data: created });
});

export const getBarberPortfolio = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const portfolio = await BarberPortfolio.find({ barberId }).sort({ displayOrder: 1 });
  res.status(200).json({ success: true, data: portfolio });
});
