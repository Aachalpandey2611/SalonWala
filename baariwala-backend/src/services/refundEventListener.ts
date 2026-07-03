import { EventBusService } from './eventBus.service';
import { RefundService } from './refund.service';
import { logger } from '../utils/logger';

export function initializeRefundEventListeners() {
  
  // Listen for Appointment Cancelled -> Auto-initiate Refund Request
  EventBusService.subscribe('AppointmentCancelled', 'RefundEngine', async (payload: any) => {
    try {
      const { appointmentId, cancelledBy } = payload;
      logger.info(`[RefundEventListener] Processing cancellation for Booking ${appointmentId}`);
      await RefundService.initiateRefundForCancellation(appointmentId, cancelledBy);
    } catch (error) {
      logger.error(`[RefundEventListener] Failed to process cancellation refund`, error);
    }
  });
  
}
