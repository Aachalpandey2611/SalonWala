import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { MonitoringService } from './monitoring.service';
import { AlertSeverity } from '../models/Alert';

export const setupMonitoringEventListeners = () => {
  
  EventBusService.subscribe('PaymentFailed', 'MonitoringEngine', async (payload: any) => {
    try {
      // In a real scenario, we might check if this happens > 5 times in a minute before alerting
      await MonitoringService.triggerAlert(
        'Payment Failure Spike',
        `Payment failed for Booking ${payload.bookingId}`,
        AlertSeverity.WARNING,
        'PAYMENT_MONITOR'
      );
    } catch (error) {
      logger.error('MonitoringEngine error on PaymentFailed', error);
    }
  });

};
