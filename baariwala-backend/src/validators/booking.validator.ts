import { z } from 'zod';
import { BookingSource, BookingStatus } from '../models/Appointment';

export const bookingSchemas = {
  // CREATE APPOINTMENT
  createAppointment: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      branchId: z.string().min(1, 'Branch ID is required'),
      barberId: z.string().min(1, 'Barber ID is required'),
      customerId: z.string().min(1, 'Customer ID is required'), // Usually from req.user, but can be provided by admin
      
      primaryServiceId: z.string().min(1, 'Primary Service ID is required'),
      selectedAddons: z.array(z.string()).default([]),
      
      appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
      appointmentStartTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid HH:MM time format'),
      appointmentEndTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid HH:MM time format'),
      reservedDurationInMinutes: z.number().int().min(1),
      
      bookedPrice: z.number().min(0),
      appliedTax: z.number().min(0).default(0),
      appliedDiscounts: z.number().min(0).default(0),
      
      source: z.nativeEnum(BookingSource).default(BookingSource.APP),
      
      notes: z.object({
        customerNotes: z.string().max(1000).optional(),
        salonNotes: z.string().max(1000).optional(),
        hairPreferences: z.string().max(500).optional(),
        specialInstructions: z.string().max(500).optional(),
        allergies: z.string().max(200).optional(),
        sensitiveSkin: z.boolean().default(false),
        otherNotes: z.string().max(500).optional(),
      }).optional()
    }).refine(data => {
      // Basic check to ensure start time < end time (ignoring midnight wrap for this iteration)
      return data.appointmentStartTime < data.appointmentEndTime;
    }, {
      message: 'Start time must be before end time',
      path: ['appointmentEndTime'],
    }),
  }),

  // UPDATE APPOINTMENT
  updateAppointment: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
      status: z.nativeEnum(BookingStatus).optional(),
      primaryServiceId: z.string().optional(),
      selectedAddons: z.array(z.string()).optional(),
      appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      appointmentStartTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/).optional(),
      appointmentEndTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/).optional(),
      reservedDurationInMinutes: z.number().int().min(1).optional(),
      bookedPrice: z.number().min(0).optional(),
      
      updateReason: z.string().optional(), // Used for audit logging
    }),
  }),

  // SEARCH APPOINTMENTS
  searchAppointments: z.object({
    query: z.object({
      bookingNumber: z.string().optional(),
      customerId: z.string().optional(),
      salonId: z.string().optional(),
      branchId: z.string().optional(),
      barberId: z.string().optional(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      status: z.nativeEnum(BookingStatus).optional(),
    }),
  }),
};
