import mongoose, { Document, Schema } from 'mongoose';

export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING_PAYMENT = 'PENDING_PAYMENT'
}

export interface IUserMembership extends Document {
  customerId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  
  status: MembershipStatus;
  
  startDate: Date;
  endDate: Date;
  
  autoRenew: boolean;
  
  // Fields for tracking payment link logic
  latestPaymentId?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const userMembershipSchema = new Schema<IUserMembership>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: 'MembershipPlan', required: true, index: true },
    
    status: { type: String, enum: Object.values(MembershipStatus), default: MembershipStatus.PENDING_PAYMENT, index: true },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    autoRenew: { type: Boolean, default: true },
    
    latestPaymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one active membership at a time
userMembershipSchema.index({ customerId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'ACTIVE' } });

export const UserMembership = mongoose.model<IUserMembership>('UserMembership', userMembershipSchema);
