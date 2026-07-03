import { GeneratedReport, ReportStatus } from '../models/GeneratedReport';
import { ReportAudit, ReportAuditAction } from '../models/ReportAudit';
import { ExportHistory } from '../models/ExportHistory';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export class ReportService {
  /**
   * Triggers an asynchronous report generation by creating a PENDING record 
   * and firing an event.
   */
  static async requestReport(salonId: string, requestedBy: string, reportCode: string, format: string, parameters: any, branchId?: string) {
    const report = await GeneratedReport.create({
      salonId,
      branchId,
      reportCode,
      format,
      requestedBy,
      parameters,
      status: ReportStatus.PENDING
    });

    await ReportAudit.create({
      salonId,
      action: ReportAuditAction.REPORT_REQUESTED,
      performedBy: requestedBy,
      targetId: report._id
    });

    // Fire async trigger
    await EventBusService.publish('ReportRequested', {
      reportId: report._id,
      salonId,
      reportCode,
      format,
      parameters
    }, 'ReportsEngine');

    return report;
  }

  /**
   * Process a report in the background
   * This is triggered by the EventListener
   */
  static async generateReportInternal(reportId: string) {
    try {
      const report = await GeneratedReport.findById(reportId);
      if (!report) return;

      report.status = ReportStatus.PROCESSING;
      await report.save();

      // MOCK GENERATION LOGIC
      // In production, this would use AnalyticsService to fetch heavy pipelines, 
      // convert to CSV/PDF, and upload to S3.
      
      // Simulate heavy processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      report.fileUrl = `https://s3.SalonWala.com/reports/${report.salonId}/${report._id}.${report.format.toLowerCase()}`;
      report.status = ReportStatus.COMPLETED;
      await report.save();

      await ReportAudit.create({
        salonId: report.salonId,
        action: ReportAuditAction.REPORT_GENERATED,
        performedBy: report.requestedBy, // Could be SYSTEM
        targetId: report._id
      });

      // Fire completion event
      await EventBusService.publish('ReportGenerated', {
        reportId: report._id,
        salonId: report.salonId
      }, 'ReportsEngine');

    } catch (error: any) {
      logger.error(`[ReportsEngine] Failed to generate report ${reportId}`, error);
      await GeneratedReport.findByIdAndUpdate(reportId, { 
        status: ReportStatus.FAILED, 
        errorMessage: error.message 
      });
    }
  }

  /**
   * Check status
   */
  static async getReportStatus(reportId: string, salonId: string) {
    const report = await GeneratedReport.findOne({ _id: reportId, salonId });
    if (!report) throw new AppError('Report not found', 404);
    return report;
  }

  /**
   * Download / Record Export
   */
  static async logExport(reportId: string, userId: string, salonId: string, reqContext: any) {
    const report = await GeneratedReport.findOne({ _id: reportId, salonId, status: ReportStatus.COMPLETED });
    if (!report) throw new AppError('Report not available', 404);

    await ExportHistory.create({
      salonId,
      generatedReportId: report._id,
      downloadedBy: userId,
      ipAddress: reqContext.ip,
      userAgent: reqContext.userAgent
    });

    return report.fileUrl;
  }
}
