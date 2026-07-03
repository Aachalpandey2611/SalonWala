import { EventBusService } from './eventBus.service';
import { CommissionService } from './commission.service';
import { logger } from '../utils/logger';

export function initializeCommissionEventListeners() {
  
  // Listen for Appointment Completed -> Calculate Commission
  EventBusService.subscribe('AppointmentCompleted', 'CommissionEngine', async (payload: any) => {
    try {
      const { appointmentId } = payload;
      logger.info(`[CommissionEventListener] Calculating commission for Booking ${appointmentId}`);
      await CommissionService.processAppointmentCommission(appointmentId);
    } catch (error) {
      logger.error(`[CommissionEventListener] Failed to calculate commission`, error);
    }
  });

  // Listen for Appointment Cancelled -> Cancel Commission fully
  EventBusService.subscribe('AppointmentCancelled', 'CommissionEngine', async (payload: any) => {
    try {
      const { appointmentId } = payload;
      logger.info(`[CommissionEventListener] Cancelling commissions for Booking ${appointmentId}`);
      // Assuming total cancellation means 100% refund ratio
      await CommissionService.reverseCommission(appointmentId, 1, 1);
    } catch (error) {
      logger.error(`[CommissionEventListener] Failed to cancel commission`, error);
    }
  });
  
  EventBusService.subscribe('RefundCompleted', 'CommissionEngine', async (payload: any) => {
    try {
      const { bookingId, refundAmount, originalAmount } = payload;
      if (bookingId && refundAmount && originalAmount) {
        logger.info(`[CommissionEventListener] Reversing commissions for Refunded Booking ${bookingId}`);
        await CommissionService.reverseCommission(bookingId, refundAmount, originalAmount);
      }
    } catch (error) {
      logger.error(`[CommissionEventListener] Failed to cancel commission on refund`, error);
    }
  });
}
