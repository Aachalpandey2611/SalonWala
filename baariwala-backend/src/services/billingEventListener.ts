import { EventBusService } from './eventBus.service';
import { BillingService } from './billing.service';
import { Invoice } from '../models/Invoice';
import { logger } from '../utils/logger';
import { PaymentStatus } from '../models/Invoice';

export function initializeBillingEventListeners() {
  
  // Listen for Appointment Completed -> Auto-generate Invoice
  EventBusService.subscribe('AppointmentCompleted', 'BillingEngine', async (payload: any) => {
    try {
      const { appointmentId } = payload;
      logger.info(`[BillingEventListener] Auto-generating invoice for Booking ${appointmentId}`);
      await BillingService.generateInvoice(appointmentId);
    } catch (error) {
      logger.error(`[BillingEventListener] Failed to auto-generate invoice`, error);
    }
  });

  // Listen for Payment Captured -> Mark Invoice as Paid
  EventBusService.subscribe('PaymentCaptured', 'BillingEngine', async (payload: any) => {
    try {
      const { bookingId, paymentId } = payload;
      
      const invoice = await Invoice.findOne({ bookingId });
      if (invoice) {
        logger.info(`[BillingEventListener] Updating invoice payment status to PAID for Invoice ${invoice.invoiceNumber}`);
        await BillingService.updatePaymentStatus(invoice._id.toString(), PaymentStatus.PAID, paymentId);
      }
    } catch (error) {
      logger.error(`[BillingEventListener] Failed to update invoice payment status`, error);
    }
  });
  
}
