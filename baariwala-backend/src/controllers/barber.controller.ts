import { Request, Response } from 'express';
import { Barber, BarberEmploymentStatus } from '../models/Barber';
import { BarberBranchAssignment, AssignmentType } from '../models/BarberBranchAssignment';
import { BarberEmployment } from '../models/BarberEmployment';
import { Salon } from '../models/Salon';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

// Verification guards
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
  
  // Barber self-editing constraint
  if (role === UserRole.BARBER) {
    if (barber.userId?.toString() !== userId) {
      throw new AppError('You can only edit your own profile', 403);
    }
    return barber;
  }
  
  await verifySalonOwnership(barber.salonId.toString(), userId, role);
  return barber;
};

// ==========================================
// BARBER PROFILE CRUD
// ==========================================
export const createBarber = catchAsync(async (req: Request, res: Response) => {
  await verifySalonOwnership(req.body.salonId, req.user!.id, req.user!.role);
  
  // Prevent duplicate employee code in the same salon
  const existingCode = await Barber.findOne({ salonId: req.body.salonId, employeeCode: req.body.employeeCode });
  if (existingCode) throw new AppError('Employee Code already exists in this salon', 400);

  const barber = await Barber.create(req.body);
  
  // Log employment history
  await BarberEmployment.create({
    barberId: barber._id,
    salonId: barber.salonId,
    status: barber.employmentStatus,
    updatedBy: req.user!.id,
    reason: 'Initial Onboarding'
  });
  
  // Create primary branch assignment
  await BarberBranchAssignment.create({
    barberId: barber._id,
    branchId: barber.defaultBranchId,
    salonId: barber.salonId,
    assignmentType: AssignmentType.PRIMARY,
    assignedBy: req.user!.id
  });

  res.status(201).json({ success: true, data: barber });
});

export const updateBarber = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.id as string;
  const barber = await verifyBarberOwnership(barberId, req.user!.id, req.user!.role);
  
  // If employment status changes, log it
  if (req.body.employmentStatus && req.body.employmentStatus !== barber.employmentStatus) {
    await BarberEmployment.create({
      barberId: barber._id,
      salonId: barber.salonId,
      status: req.body.employmentStatus,
      updatedBy: req.user!.id,
      reason: 'Status Update'
    });
  }
  
  Object.assign(barber, req.body);
  await barber.save();
  
  res.status(200).json({ success: true, data: barber });
});

export const getBarberDetails = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.id as string;
  const barber = await Barber.findById(barberId)
    .populate('salonId', 'name')
    .populate('defaultBranchId', 'name address');
    
  if (!barber) throw new AppError('Barber not found', 404);
  res.status(200).json({ success: true, data: barber });
});

// ==========================================
// SEARCH & FILTER
// ==========================================
export const searchBarbers = catchAsync(async (req: Request, res: Response) => {
  const { salonId, branchId, status, search, minExperience } = req.query;
  const query: any = {};
  
  if (salonId) query.salonId = salonId;
  if (branchId) query.defaultBranchId = branchId;
  if (status) query.employmentStatus = status;
  if (minExperience) query.experienceInYears = { $gte: Number(minExperience) };
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { employeeCode: { $regex: search, $options: 'i' } }
    ];
  }
  
  const barbers = await Barber.find(query).sort({ averageRating: -1 });
  res.status(200).json({ success: true, data: barbers });
});

// ==========================================
// BRANCH ASSIGNMENTS
// ==========================================
export const assignBranch = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const barber = await verifyBarberOwnership(barberId, req.user!.id, req.user!.role);
  
  const { branchId, assignmentType, validFrom, validTo } = req.body;
  
  const existing = await BarberBranchAssignment.findOne({ barberId, branchId, isActive: true });
  if (existing) throw new AppError('Barber is already assigned to this branch', 400);

  const assignment = await BarberBranchAssignment.create({
    barberId,
    branchId,
    salonId: barber.salonId,
    assignmentType,
    validFrom,
    validTo,
    assignedBy: req.user!.id
  });

  res.status(201).json({ success: true, data: assignment });
});
