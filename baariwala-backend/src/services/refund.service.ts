import mongoose from 'mongoose';
import { Refund, RefundStatus, RefundType, RefundDestination } from '../models/Refund';
import { RefundRequest, RefundRequestStatus } from '../models/RefundRequest';
import { Payment } from '../models/Payment';
import { Appointment, BookingStatus } from '../models/Appointment';
import { AppError } from '../utils/AppError';
import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export class RefundService {
  /**
   * Evaluate Cancellation Policy & Initiate Refund Request
   */
  static async initiateRefundForCancellation(bookingId: string, cancelledBy: 'CUSTOMER' | 'SALON') {
    const booking = await Appointment.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    
    // Check if payment exists
    const payment = await Payment.findOne({ bookingId: booking._id });
    if (!payment) {
      logger.info(`[RefundService] No payment found for Booking ${bookingId}, skipping refund`);
      return null;
    }
    
    // In an Enterprise system, we would fetch Salon Cancellation Policy rules here.
    // For this demonstration, if Salon cancels -> 100% refund.
    // If Customer cancels -> 100% if > 24hrs, 50% if < 24hrs.
    let eligibleAmount = payment.amount;
    let type = RefundType.FULL;
    
    if (cancelledBy === 'CUSTOMER') {
      const [hours, minutes] = booking.appointmentStartTime.split(':').map(Number);
      const appointmentDateTime = new Date(booking.appointmentDate);
      appointmentDateTime.setHours(hours, minutes, 0, 0);
      
      const hoursUntilAppointment = (appointmentDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
      if (hoursUntilAppointment < 24) {
        eligibleAmount = payment.amount / 2; // 50% penalty
        type = RefundType.PARTIAL;
      }
    }
    
    if (eligibleAmount <= 0) return null;
    
    const refundRequest = await RefundRequest.create({
      bookingId: booking._id,
      customerId: booking.customerId,
      requestedAmount: eligibleAmount,
      reason: `Auto-generated refund due to ${cancelledBy} cancellation`,
      preferredDestination: RefundDestination.ORIGINAL_PAYMENT_METHOD
    });
    
    EventBusService.publish('RefundInitiated', { refundRequestId: refundRequest._id, bookingId: booking._id }, 'RefundEngine');
    
    return refundRequest;
  }
  
  /**
   * Process an approved refund
   */
  static async processRefund(refundRequestId: string, adminId: string) {
    const request = await RefundRequest.findById(refundRequestId);
    if (!request || request.status !== RefundRequestStatus.PENDING) {
      throw new AppError('Invalid or already processed refund request', 400);
    }
    
    const booking = await Appointment.findById(request.bookingId);
    const payment = await Payment.findOne({ bookingId: request.bookingId });
    
    if (!booking || !payment) throw new AppError('Booking or Payment data missing', 404);
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      request.status = RefundRequestStatus.APPROVED;
      request.approvedAmount = request.requestedAmount;
      request.reviewedBy = new mongoose.Types.ObjectId(adminId);
      await request.save({ session });
      
      const refund = await Refund.create([{
        refundRequestId: request._id,
        bookingId: request.bookingId,
        paymentId: payment._id,
        customerId: request.customerId,
        salonId: booking.salonId,
        amount: request.approvedAmount,
        currency: 'INR',
        refundType: request.requestedAmount === payment.amount ? RefundType.FULL : RefundType.PARTIAL,
        destination: request.preferredDestination,
        status: RefundStatus.PROCESSING
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      // We would now contact the Payment Gateway or Wallet service.
      // Mocking Gateway Refund Process:
      await this.mockGatewayRefund(refund[0]._id.toString());
      
      return refund[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError('Failed to process refund', 500);
    }
  }
  
  private static async mockGatewayRefund(refundId: string) {
    const refund = await Refund.findById(refundId);
    if (!refund) return;
    
    refund.status = RefundStatus.COMPLETED;
    refund.processedAt = new Date();
    refund.gatewayRefundId = `ref_${Date.now()}`;
    await refund.save();
    
    EventBusService.publish('RefundCompleted', {
      refundId: refund._id,
      amount: refund.amount,
      bookingId: refund.bookingId
    }, 'RefundEngine');
  }
}
