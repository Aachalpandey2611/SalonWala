import { z } from 'zod';
import { BarberEmploymentStatus, BarberVerificationStatus } from '../models/Barber';
import { SkillLevel } from '../models/BarberSkill';
import { CertificationStatus } from '../models/BarberCertification';
import { PortfolioCategory } from '../models/BarberPortfolio';
import { AssignmentType } from '../models/BarberBranchAssignment';

export const barberSchemas = {
  // BARBER PROFILE
  createBarber: z.object({
    body: z.object({
      employeeCode: z.string().min(2, 'Employee code must be at least 2 characters'),
      salonId: z.string().min(1, 'Salon ID is required'),
      defaultBranchId: z.string().min(1, 'Default Branch ID is required'),
      userId: z.string().optional(),
      
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      phone: z.string().min(10),
      email: z.string().email().optional(),
      gender: z.string().min(1),
      
      dateOfBirth: z.string().optional(),
      joiningDate: z.string().optional(),
      experienceInYears: z.number().min(0).default(0),
      biography: z.string().max(1000).optional(),
      languagesSpoken: z.array(z.string()).default([]),
      
      employmentStatus: z.nativeEnum(BarberEmploymentStatus).default(BarberEmploymentStatus.ACTIVE),
    }),
  }),
  updateBarber: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
      firstName: z.string().min(2).optional(),
      lastName: z.string().min(2).optional(),
      phone: z.string().min(10).optional(),
      email: z.string().email().optional(),
      gender: z.string().min(1).optional(),
      dateOfBirth: z.string().optional(),
      experienceInYears: z.number().min(0).optional(),
      biography: z.string().max(1000).optional(),
      languagesSpoken: z.array(z.string()).optional(),
      employmentStatus: z.nativeEnum(BarberEmploymentStatus).optional(),
      verificationStatus: z.nativeEnum(BarberVerificationStatus).optional(),
    }),
  }),

  // BARBER SKILL
  assignSkill: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      serviceId: z.string().min(1),
      skillLevel: z.nativeEnum(SkillLevel).default(SkillLevel.INTERMEDIATE),
      yearsOfExperience: z.number().min(0).default(0),
      internalNotes: z.string().max(500).optional(),
    }),
  }),
  
  // BARBER BRANCH ASSIGNMENT
  assignBranch: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      branchId: z.string().min(1),
      assignmentType: z.nativeEnum(AssignmentType).default(AssignmentType.SECONDARY),
      validFrom: z.string().optional(),
      validTo: z.string().optional(),
    }),
  }),

  // PORTFOLIO & CERTIFICATIONS (Only basic bodies, files are handled by multer)
  uploadPortfolio: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      category: z.nativeEnum(PortfolioCategory).default(PortfolioCategory.OTHER),
      caption: z.string().max(200).optional(),
      displayOrder: z.string().optional(), // Multiform data comes as string
    }),
  }),
  
  uploadCertification: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      certificateName: z.string().min(2),
      issuedBy: z.string().min(2),
      issueDate: z.string(),
      expiryDate: z.string().optional(),
    }),
  }),
};
