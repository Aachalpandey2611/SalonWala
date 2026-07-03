import { EventBusService } from './eventBus.service';
import { ReportService } from './report.service';
import { logger } from '../utils/logger';

export const setupReportEventListeners = () => {
  
  // Background Report Generation Worker
  EventBusService.subscribe('ReportRequested', 'ReportsEngine', async (payload: any) => {
    try {
      const { reportId } = payload;
      logger.info(`[ReportsEngine] Received async trigger for Report ${reportId}`);
      
      // Execute Heavy Processing
      await ReportService.generateReportInternal(reportId);
      
    } catch (error) {
      logger.error(`[ReportsEngine] Failed processing ReportRequested payload`, error);
    }
  });
};
