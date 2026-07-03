import { Request, Response } from 'express';
import { ReportService } from '../services/report.service';
import { catchAsync } from '../utils/catchAsync';

export const requestReportController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { reportCode, format, parameters, branchId } = req.body;

  const report = await ReportService.requestReport(
    salonId, 
    req.user!.id, 
    reportCode, 
    format, 
    parameters || {}, 
    branchId
  );

  res.status(202).json({ success: true, message: 'Report generation started', data: report });
});

export const getReportStatusController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { id } = req.params;

  const report = await ReportService.getReportStatus(id as string, salonId);

  res.status(200).json({ success: true, data: report });
});

export const downloadReportController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { id } = req.params;

  const reqContext = { ip: req.ip, userAgent: req.headers['user-agent'] };
  
  const fileUrl = await ReportService.logExport(id as string, req.user!.id, salonId, reqContext);

  res.status(200).json({ success: true, data: { fileUrl } });
});
