import { Salon } from '../models/Salon';
import { SalonBranch } from '../models/SalonBranch';
import { Barber, BarberEmploymentStatus } from '../models/Barber';
import { User } from '../models/User';
import { SalonService } from '../models/SalonService';
import { ServiceAddon } from '../models/ServiceAddon';
import { BarberSkill } from '../models/BarberSkill';
import { BarberLeave, LeaveStatus } from '../models/BarberLeave';
import { AvailabilityException, ExceptionType } from '../models/AvailabilityException';
import { Appointment, BookingStatus } from '../models/Appointment';
import { Holiday } from '../models/Holiday';

export interface ValidationRequest {
  salonId: string;
  branchId: string;
  barberId: string;
  customerId: string;
  primaryServiceId: string;
  selectedAddons?: string[];
  appointmentDate: string; // YYYY-MM-DD
  appointmentStartTime: string; // HH:MM
}

export interface ValidationResponse {
  valid: boolean;
  reason?: string;
  errorCode?: string;
  reservedDuration?: number;
  recommendedSlot?: string;
}

export class ValidationService {
  
  static async validateBooking(req: ValidationRequest): Promise<ValidationResponse> {
    const { salonId, branchId, barberId, customerId, primaryServiceId, selectedAddons, appointmentDate, appointmentStartTime } = req;
    
    // 1. Entity Existence & Basic Linkage
    const salon = await Salon.findById(salonId);
    if (!salon) return { valid: false, reason: 'Salon does not exist', errorCode: 'SALON_NOT_FOUND' };
    
    const branch = await SalonBranch.findById(branchId);
    if (!branch || branch.salonId.toString() !== salonId) return { valid: false, reason: 'Invalid Branch', errorCode: 'BRANCH_INVALID' };
    
    const customer = await User.findById(customerId);
    if (!customer) return { valid: false, reason: 'Customer does not exist', errorCode: 'CUSTOMER_NOT_FOUND' };
    
    const barber = await Barber.findById(barberId);
    if (!barber || barber.salonId.toString() !== salonId) return { valid: false, reason: 'Invalid Barber', errorCode: 'BARBER_INVALID' };
    
    const service = await SalonService.findById(primaryServiceId);
    if (!service || service.salonId.toString() !== salonId) return { valid: false, reason: 'Invalid Service', errorCode: 'SERVICE_INVALID' };

    // 2. Barber Status Validation
    if (barber.employmentStatus === BarberEmploymentStatus.SUSPENDED) return { valid: false, reason: 'Barber is suspended', errorCode: 'BARBER_SUSPENDED' };
    if (barber.employmentStatus === BarberEmploymentStatus.TERMINATED || barber.employmentStatus === BarberEmploymentStatus.RESIGNED) {
      return { valid: false, reason: 'Barber no longer works here', errorCode: 'BARBER_UNAVAILABLE' };
    }

    // 3. Skill Validation
    const skill = await BarberSkill.findOne({ barberId, serviceId: primaryServiceId });
    if (!skill) return { valid: false, reason: 'Barber does not possess the required skill for this service', errorCode: 'SKILL_MISSING' };

    // 4. Time Validation
    const targetDate = new Date(appointmentDate);
    const targetDateTime = new Date(`${appointmentDate}T${appointmentStartTime}:00`);
    if (targetDateTime < new Date()) {
      return { valid: false, reason: 'Cannot book a slot in the past', errorCode: 'PAST_TIME' };
    }

    // 5. Salon & Barber Schedule Exceptions (Holidays, Leaves, Emergency)
    const holiday = await Holiday.findOne({
      salonId,
      $or: [{ branchId }, { branchId: { $exists: false } }],
      date: appointmentDate
    });
    if (holiday) return { valid: false, reason: 'Salon is closed on this holiday', errorCode: 'SALON_HOLIDAY' };

    const leave = await BarberLeave.findOne({
      barberId,
      status: LeaveStatus.APPROVED,
      startDate: { $lte: targetDate },
      endDate: { $gte: targetDate }
    });
    if (leave) return { valid: false, reason: 'Barber is on approved leave', errorCode: 'BARBER_ON_LEAVE' };

    const exception = await AvailabilityException.findOne({
      barberId,
      type: ExceptionType.FORCE_UNAVAILABLE,
      startTime: { $lte: targetDateTime },
      endTime: { $gte: targetDateTime }
    });
    if (exception) return { valid: false, reason: 'Barber is completely unavailable due to emergency block', errorCode: 'BARBER_EMERGENCY_BLOCK' };

    // 6. Buffer & Duration Math (Consume Service Catalog Math)
    let totalDuration = service.totalCalculatedDuration; // base duration (prep + service + cleanup)
    if (selectedAddons && selectedAddons.length > 0) {
      const addons = await ServiceAddon.find({ _id: { $in: selectedAddons }, parentServiceId: primaryServiceId });
      if (addons.length !== selectedAddons.length) return { valid: false, reason: 'One or more invalid add-ons selected', errorCode: 'ADDON_INVALID' };
      
      addons.forEach(addon => {
        totalDuration += (addon.additionalPreparationTimeInMinutes + addon.additionalDurationInMinutes + addon.additionalCleanupTimeInMinutes);
      });
    }

    // 7. Double Booking Prevention (Overlapping Appointments)
    // Convert HH:MM to total minutes from midnight for math
    const [startH, startM] = appointmentStartTime.split(':').map(Number);
    const requestedStartMinutes = startH * 60 + startM;
    const requestedEndMinutes = requestedStartMinutes + totalDuration;

    // Fetch existing active appointments for the barber on this day
    const existingAppointments = await Appointment.find({
      barberId,
      appointmentDate: targetDate,
      isDeleted: false,
      status: { $nin: [BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_SALON, BookingStatus.REJECTED, BookingStatus.EXPIRED, BookingStatus.NO_SHOW] }
    });

    for (const appt of existingAppointments) {
      const [exStartH, exStartM] = appt.appointmentStartTime.split(':').map(Number);
      const exStartMinutes = exStartH * 60 + exStartM;
      const exEndMinutes = exStartMinutes + appt.reservedDurationInMinutes;

      // Check overlap
      // Overlap logic: Math.max(start1, start2) < Math.min(end1, end2)
      if (Math.max(requestedStartMinutes, exStartMinutes) < Math.min(requestedEndMinutes, exEndMinutes)) {
        // Find next free slot as recommendation
        const nextH = Math.floor(exEndMinutes / 60).toString().padStart(2, '0');
        const nextM = (exEndMinutes % 60).toString().padStart(2, '0');
        
        return { 
          valid: false, 
          reason: 'Slot overlaps with an existing appointment', 
          errorCode: 'DOUBLE_BOOKING',
          recommendedSlot: `${nextH}:${nextM}` // Intelligent Suggestion (mock)
        };
      }
    }

    // 8. Future Capacity Logic Placeholder
    // TODO: if (room.capacity < 1) return { valid: false, reason: 'Room full' }

    return {
      valid: true,
      reservedDuration: totalDuration
    };
  }

}
