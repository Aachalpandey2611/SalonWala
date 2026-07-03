import mongoose, { Document, Schema } from 'mongoose';

export enum RefundStatus {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED'
}

export enum RefundType {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL'
}

export enum RefundDestination {
  ORIGINAL_PAYMENT_METHOD = 'ORIGINAL_PAYMENT_METHOD',
  WALLET = 'WALLET',
  STORE_CREDIT = 'STORE_CREDIT'
}

export interface IRefund extends Document {
  refundRequestId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId; // Original Payment
  customerId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  amount: number;
  currency: string;
  
  refundType: RefundType;
  destination: RefundDestination;
  status: RefundStatus;
  
  gatewayRefundId?: string;
  reason?: string;
  
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refundSchema = new Schema<IRefund>(
  {
    refundRequestId: { type: Schema.Types.ObjectId, ref: 'RefundRequest', required: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
    
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'INR' },
    
    refundType: { type: String, enum: Object.values(RefundType), required: true },
    destination: { type: String, enum: Object.values(RefundDestination), required: true },
    status: { type: String, enum: Object.values(RefundStatus), default: RefundStatus.INITIATED, index: true },
    
    gatewayRefundId: { type: String },
    reason: { type: String },
    
    processedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Refund = mongoose.model<IRefund>('Refund', refundSchema);
