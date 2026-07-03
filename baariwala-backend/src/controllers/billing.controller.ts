import { Request, Response } from 'express';
import { BillingService } from '../services/billing.service';
import { Invoice } from '../models/Invoice';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

export const generateInvoiceController = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const invoice = await BillingService.generateInvoice(bookingId);
  res.status(201).json({ success: true, data: invoice });
});

export const getInvoiceController = catchAsync(async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId as string;
  const invoice = await Invoice.findById(invoiceId);
  
  if (!invoice) throw new AppError('Invoice not found', 404);
  
  // Authorization check (Admin/Salon Owner OR Customer that owns the invoice)
  if (req.user!.role === UserRole.CUSTOMER && invoice.customerId.toString() !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }
  
  res.status(200).json({ success: true, data: invoice });
});

export const getInvoicesController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role === UserRole.CUSTOMER) {
    filter.customerId = req.user!.id;
  } else if (req.query.salonId) {
    filter.salonId = req.query.salonId;
  }
  
  const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: invoices });
});

export const downloadInvoicePdfController = catchAsync(async (req: Request, res: Response) => {
  const invoiceId = req.params.invoiceId as string;
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new AppError('Invoice not found', 404);
  
  if (req.user!.role === UserRole.CUSTOMER && invoice.customerId.toString() !== req.user!.id) {
    throw new AppError('Unauthorized', 403);
  }
  
  const pdfUrl = await BillingService.generatePDF(invoiceId);
  res.status(200).json({ success: true, data: { pdfUrl } });
});
