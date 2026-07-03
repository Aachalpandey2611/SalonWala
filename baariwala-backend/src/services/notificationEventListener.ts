import { internalEventBus } from './eventBus.service';
import { NotificationService } from './notification.service';
import { NotificationType } from '../models/NotificationChannel';
import { logger } from '../utils/logger';

/**
 * Initializes all Notification subscriptions to the EventBus
 */
export function initializeNotificationEventListeners() {
  
  // 1. Appointment Created -> Booking Confirmation
  internalEventBus.on('AppointmentCreated', async (eventDoc) => {
    try {
      const payload = JSON.parse(eventDoc.payload);
      
      await NotificationService.dispatch(
        payload.customerId,
        NotificationType.BOOKING_CONFIRMATION,
        {
          customerName: payload.customerName || 'Customer',
          salonName: payload.salonName || 'SalonWala',
          appointmentDate: payload.appointmentDate || 'your scheduled date',
          appointmentTime: payload.appointmentTime || 'your scheduled time',
        },
        payload.appointmentId,
        'Appointment'
      );
    } catch (e) {
      logger.error(`[NotificationEventListener] Error processing AppointmentCreated:`, e);
      // Let EventBus handling deal with failures if we used EventBusService.subscribe
      // Since we just attach to the emitter directly for simplicity, we swallow here or re-throw.
    }
  });

  // 2. Appointment Cancelled
  internalEventBus.on('AppointmentCancelled', async (eventDoc) => {
    try {
      const payload = JSON.parse(eventDoc.payload);
      
      await NotificationService.dispatch(
        payload.customerId,
        NotificationType.APPOINTMENT_CANCELLED,
        {
          customerName: payload.customerName || 'Customer',
          salonName: payload.salonName || 'SalonWala',
        },
        payload.appointmentId,
        'Appointment'
      );
    } catch (e) {
      logger.error(`[NotificationEventListener] Error processing AppointmentCancelled:`, e);
    }
  });

  // 3. Queue Updated (ETA Shift)
  internalEventBus.on('QueueETAUpdated', async (eventDoc) => {
    try {
      const payload = JSON.parse(eventDoc.payload);
      
      await NotificationService.dispatch(
        payload.customerId,
        NotificationType.QUEUE_UPDATES,
        {
          customerName: payload.customerName || 'Customer',
          estimatedWaitTime: payload.estimatedWaitTime || '0',
          queuePosition: payload.queuePosition || '1',
        },
        payload.queueEntryId,
        'QueueEntry'
      );
    } catch (e) {
      logger.error(`[NotificationEventListener] Error processing QueueETAUpdated:`, e);
    }
  });

  logger.info('[NotificationEventListener] Subscribed to EventBus successfully.');
}
