import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { ForecastService } from './forecast.service';

export const setupForecastEventListeners = () => {
  
  // Example trigger: When a major Analytics Snapshot happens (e.g. End of Day), 
  // trigger the ML Pipeline to generate new forecasts for tomorrow.
  EventBusService.subscribe('AnalyticsSnapshotCreated', 'ForecastEngine', async (payload: any) => {
    try {
      const { salonId, branchId } = payload;
      
      // Generate advisory forecasts silently in the background
      await ForecastService.generateRevenueForecast(salonId, branchId);
      
      logger.info(`[ForecastEngine] Generated Revenue Forecasts & Recommendations for Salon ${salonId}`);
      
      // Optionally publish a 'ForecastGenerated' event if other modules need to know
      EventBusService.publish('ForecastGenerated', { salonId, branchId, timestamp: new Date() });
      
    } catch (error) {
      logger.error(`[ForecastEngine] Forecasting simulation failed`, error);
    }
  });

};
