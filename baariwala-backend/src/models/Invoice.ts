import mongoose, { Document, Schema } from 'mongoose';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  ISSUED = 'ISSUED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  VOIDED = 'VOIDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  invoiceDate: Date;
  
  customerId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  currency: string;
  
  subtotal: number;
  discount: number;
  taxTotal: number;
  grandTotal: number;
  
  pdfUrl?: string; // Optional future-ready field for S3/Blob storage
  
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    invoiceDate: { type: Date, required: true, default: Date.now },
    
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Appointment', index: true },
    
    status: { type: String, enum: Object.values(InvoiceStatus), default: InvoiceStatus.DRAFT, index: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    currency: { type: String, required: true, default: 'INR' },
    
    subtotal: { type: Number, required: true, default: 0, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    taxTotal: { type: Number, required: true, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, default: 0, min: 0 },
    
    pdfUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

// Prevent negative totals
invoiceSchema.pre('save', function (next: any) {
  if (this.grandTotal < 0) {
    next(new Error('Grand Total cannot be negative'));
  } else {
    next();
  }
});

// Performance Optimization: Phase 11
invoiceSchema.index({ customerId: 1, paymentStatus: 1, createdAt: -1 });
invoiceSchema.index({ branchId: 1, status: 1, createdAt: -1 });
invoiceSchema.index({ bookingId: 1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);
