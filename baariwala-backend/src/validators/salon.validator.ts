import { z } from 'zod';
import { DayOfWeek } from '../models/BusinessHours';
import { HolidayType, EmergencyReason } from '../models/Holiday';
import { GalleryImageType } from '../models/SalonGallery';
import { BranchStatus } from '../models/SalonBranch';

export const salonSchemas = {
  createSalon: z.object({
    body: z.object({
      name: z.string().min(2, 'Salon name must be at least 2 characters'),
    }),
  }),
  
  createBranch: z.object({
    params: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
    }),
    body: z.object({
      name: z.string().min(2, 'Branch name is required'),
      branchCode: z.string().min(2, 'Branch code is required'),
      phone: z.string().min(10, 'Valid phone number is required'),
      email: z.string().email().optional(),
      coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]), // [lng, lat]
      address: z.string().min(5, 'Address is required'),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      country: z.string().default('India'),
      pincode: z.string().min(4, 'Valid pincode is required'),
      timezone: z.string().default('Asia/Kolkata'),
    }),
  }),

  updateBranchStatus: z.object({
    params: z.object({
      branchId: z.string().min(1, 'Branch ID is required'),
    }),
    body: z.object({
      status: z.enum([BranchStatus.ACTIVE, BranchStatus.INACTIVE, BranchStatus.CLOSED_TEMPORARILY, BranchStatus.CLOSED_PERMANENTLY]),
    }),
  }),

  updateHours: z.object({
    params: z.object({
      branchId: z.string().min(1, 'Branch ID is required'),
    }),
    body: z.object({
      day: z.nativeEnum(DayOfWeek),
      isClosed: z.boolean().default(false),
      sessions: z.array(z.object({
        openTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
        closeTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
      })).optional(),
    }),
  }),

  createHoliday: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      branchId: z.string().optional(),
      type: z.nativeEnum(HolidayType),
      emergencyReason: z.nativeEnum(EmergencyReason).optional(),
      reason: z.string().min(1, 'Reason is required'),
      date: z.string(), // YYYY-MM-DD
      isRecurring: z.boolean().default(false),
    }).refine((data) => !(data.type === HolidayType.EMERGENCY && !data.emergencyReason), {
      message: 'Emergency reason is required when type is EMERGENCY',
      path: ['emergencyReason'],
    }),
  }),

  uploadGallery: z.object({
    params: z.object({
      branchId: z.string().min(1, 'Branch ID is required'),
    }),
    body: z.object({
      type: z.nativeEnum(GalleryImageType),
    }),
    // File validation is handled by multer, but we can't easily zod validate req.files here
  }),

  updateAmenities: z.object({
    params: z.object({
      branchId: z.string().min(1, 'Branch ID is required'),
    }),
    body: z.object({
      parking: z.boolean().optional(),
      wifi: z.boolean().optional(),
      upi: z.boolean().optional(),
      card: z.boolean().optional(),
      ac: z.boolean().optional(),
      waitingArea: z.boolean().optional(),
      wheelchairAccess: z.boolean().optional(),
      coffee: z.boolean().optional(),
      water: z.boolean().optional(),
      washroom: z.boolean().optional(),
    }),
  }),

  updatePolicies: z.object({
    params: z.object({
      branchId: z.string().min(1, 'Branch ID is required'),
    }),
    body: z.object({
      cancellationPolicy: z.string().optional(),
      refundPolicy: z.string().optional(),
      lateArrivalPolicy: z.string().optional(),
      childrenPolicy: z.string().optional(),
    }),
  }),
};
