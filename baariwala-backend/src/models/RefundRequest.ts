import mongoose, { Document, Schema } from 'mongoose';
import { RefundDestination } from './Refund';

export enum RefundRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface IRefundRequest extends Document {
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  requestedAmount: number;
  reason: string;
  preferredDestination: RefundDestination;
  
  status: RefundRequestStatus;
  
  approvedAmount?: number;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const refundRequestSchema = new Schema<IRefundRequest>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    requestedAmount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    preferredDestination: { type: String, enum: Object.values(RefundDestination), required: true },
    
    status: { type: String, enum: Object.values(RefundRequestStatus), default: RefundRequestStatus.PENDING, index: true },
    
    approvedAmount: { type: Number, min: 0 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

export const RefundRequest = mongoose.model<IRefundRequest>('RefundRequest', refundRequestSchema);
