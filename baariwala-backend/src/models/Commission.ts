import mongoose, { Document, Schema } from 'mongoose';

export enum CommissionSourceEvent {
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
  PRODUCT_SOLD = 'PRODUCT_SOLD',
  MEMBERSHIP_PURCHASED = 'MEMBERSHIP_PURCHASED'
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVERSED = 'REVERSED',
  LOCKED = 'LOCKED',
  TRANSFERRED = 'TRANSFERRED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED' // e.g. if completely aborted
}

export interface ICommission extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  // Who receives the commission
  recipientId: mongoose.Types.ObjectId; // User ID (Barber, Manager, etc.)
  
  sourceEvent: CommissionSourceEvent;
  referenceId: mongoose.Types.ObjectId; // ID of Appointment, Order, etc.
  
  baseAmount: number; // e.g., the service price or product price
  ruleAppliedId?: mongoose.Types.ObjectId; // Which rule dictated this?
  
  calculatedAmount: number; // The actual earned commission
  reversedAmount: number; // Track partial refunds
  
  isLocked: boolean; // Prevent adjustments if sent to payroll
  
  status: CommissionStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

const commissionSchema = new Schema<ICommission>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, required: true },
    
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    sourceEvent: { type: String, enum: Object.values(CommissionSourceEvent), required: true, index: true },
    referenceId: { type: Schema.Types.ObjectId, required: true, index: true },
    
    baseAmount: { type: Number, required: true, min: 0 },
    ruleAppliedId: { type: Schema.Types.ObjectId, ref: 'CommissionRule' },
    
    calculatedAmount: { type: Number, required: true },
    reversedAmount: { type: Number, default: 0 },
    
    isLocked: { type: Boolean, default: false },
    
    status: { type: String, enum: Object.values(CommissionStatus), default: CommissionStatus.PENDING, index: true },
  },
  {
    timestamps: true,
  }
);

export const Commission = mongoose.model<ICommission>('Commission', commissionSchema);
