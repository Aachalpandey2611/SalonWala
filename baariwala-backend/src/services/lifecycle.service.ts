import { Appointment, BookingStatus } from '../models/Appointment';
import { AppointmentHistory, AppointmentAction } from '../models/AppointmentHistory';
import { AppointmentAuditLog, AuditAction } from '../models/AppointmentAuditLog';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';
import mongoose from 'mongoose';

export class LifecycleService {
  
  /**
   * Internal helper to save state transition with Audit & History
   */
  private static async executeTransition(
    appointment: any,
    newState: BookingStatus,
    performedBy: string,
    action: AppointmentAction,
    reason?: string
  ) {
    const oldValueStr = JSON.stringify(appointment.toJSON());
    
    appointment.status = newState;
    await appointment.save();
    
    // History Ledger
    await AppointmentHistory.create({
      appointmentId: appointment._id,
      action,
      performedBy,
      oldValue: oldValueStr,
      newValue: JSON.stringify(appointment.toJSON()),
      reason
    });
    
    // Audit Log
    await AppointmentAuditLog.create({
      appointmentId: appointment._id,
      bookingNumber: appointment.bookingNumber,
      action: AuditAction.UPDATED, // Generalized
      performedBy,
      reason
    });
    
    return appointment;
  }

  // ==========================================
  // CONFIRM BOOKING (Pending -> Confirmed)
  // ==========================================
  static async confirmBooking(appointmentId: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    if (appointment.status !== BookingStatus.PENDING) {
      throw new AppError(`Cannot confirm. Appointment is currently ${appointment.status}`, 400);
    }
    
    return await this.executeTransition(appointment, BookingStatus.CONFIRMED, performedBy, AppointmentAction.STATUS_UPDATED);
  }

  // ==========================================
  // CHECK-IN (Confirmed -> Checked_In -> Waiting)
  // ==========================================
  static async checkIn(appointmentId: string, method: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if (appointment.status !== BookingStatus.CONFIRMED && appointment.status !== BookingStatus.PENDING) {
      throw new AppError(`Cannot check-in. Appointment is currently ${appointment.status}`, 400);
    }
    
    appointment.checkInTime = new Date();
    appointment.checkedInBy = new mongoose.Types.ObjectId(performedBy);
    appointment.checkInMethod = method; // QR, OTP, MANUAL, WALK_IN
    
    // Immediately move to WAITING after check-in logic
    return await this.executeTransition(appointment, BookingStatus.WAITING, performedBy, AppointmentAction.STATUS_UPDATED, `Check-in via ${method}`);
  }

  // ==========================================
  // ASSIGN BARBER (Waiting -> Assigned)
  // ==========================================
  static async assignBarber(appointmentId: string, newBarberId: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.WAITING].includes(appointment.status as any)) {
      throw new AppError(`Cannot assign barber. Appointment is currently ${appointment.status}`, 400);
    }
    
    appointment.barberId = new mongoose.Types.ObjectId(newBarberId);
    
    return await this.executeTransition(appointment, BookingStatus.ASSIGNED, performedBy, AppointmentAction.STATUS_UPDATED, `Assigned to barber ${newBarberId}`);
  }

  // ==========================================
  // START SERVICE (Assigned/Waiting -> In_Progress)
  // ==========================================
  static async startService(appointmentId: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if (![BookingStatus.WAITING, BookingStatus.ASSIGNED, BookingStatus.CHECKED_IN].includes(appointment.status as any)) {
      throw new AppError(`Cannot start service. Appointment is currently ${appointment.status}`, 400);
    }
    
    appointment.serviceStartTime = new Date();
    appointment.startedBy = new mongoose.Types.ObjectId(performedBy);
    
    return await this.executeTransition(appointment, BookingStatus.IN_PROGRESS, performedBy, AppointmentAction.STATUS_UPDATED);
  }

  // ==========================================
  // COMPLETE SERVICE (In_Progress -> Completed)
  // ==========================================
  static async completeService(appointmentId: string, notes: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if (appointment.status !== BookingStatus.IN_PROGRESS) {
      throw new AppError(`Cannot complete. Appointment is not IN_PROGRESS`, 400);
    }
    
    appointment.serviceCompletionTime = new Date();
    appointment.completedBy = new mongoose.Types.ObjectId(performedBy);
    appointment.completionNotes = notes;
    
    // Calculate actual duration
    if (appointment.serviceStartTime) {
      const diffMs = appointment.serviceCompletionTime.getTime() - appointment.serviceStartTime.getTime();
      appointment.actualDurationInMinutes = Math.round(diffMs / 60000);
    }
    
    return await this.executeTransition(appointment, BookingStatus.COMPLETED, performedBy, AppointmentAction.STATUS_UPDATED, notes);
  }

  // ==========================================
  // CANCEL BOOKING
  // ==========================================
  static async cancelBooking(appointmentId: string, reason: string, performedBy: string, role: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    // Can only cancel if not started/completed/cancelled
    if ([BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED, BookingStatus.CANCELLED_BY_CUSTOMER, BookingStatus.CANCELLED_BY_SALON].includes(appointment.status as any)) {
      throw new AppError(`Cannot cancel. Appointment is already ${appointment.status}`, 400);
    }
    
    appointment.cancellationReason = reason;
    appointment.cancelledBy = new mongoose.Types.ObjectId(performedBy);
    
    const newState = role === UserRole.CUSTOMER ? BookingStatus.CANCELLED_BY_CUSTOMER : BookingStatus.CANCELLED_BY_SALON;
    
    return await this.executeTransition(appointment, newState, performedBy, AppointmentAction.CANCELLED, reason);
  }

  // ==========================================
  // MARK NO SHOW
  // ==========================================
  static async markNoShow(appointmentId: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if ([BookingStatus.COMPLETED, BookingStatus.IN_PROGRESS].includes(appointment.status as any)) {
      throw new AppError(`Cannot mark NO_SHOW. Appointment is already ${appointment.status}`, 400);
    }
    
    return await this.executeTransition(appointment, BookingStatus.NO_SHOW, performedBy, AppointmentAction.STATUS_UPDATED, 'Customer did not show up');
  }

  // ==========================================
  // EXPIRE BOOKING (Auto System)
  // ==========================================
  static async expireBooking(appointmentId: string, performedBy: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    if (appointment.status !== BookingStatus.PENDING) {
      throw new AppError(`Cannot expire. Appointment is already ${appointment.status}`, 400);
    }
    
    return await this.executeTransition(appointment, BookingStatus.EXPIRED, performedBy, AppointmentAction.STATUS_UPDATED, 'Auto expired due to no action');
  }
}
