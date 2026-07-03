import mongoose, { Document, Schema } from 'mongoose';

export enum MembershipAction {
  PURCHASED = 'PURCHASED',
  RENEWED = 'RENEWED',
  UPGRADED = 'UPGRADED',
  DOWNGRADED = 'DOWNGRADED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface IMembershipHistory extends Document {
  userMembershipId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  action: MembershipAction;
  
  previousPlanId?: mongoose.Types.ObjectId;
  newPlanId?: mongoose.Types.ObjectId;
  
  notes?: string;
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const membershipHistorySchema = new Schema<IMembershipHistory>(
  {
    userMembershipId: { type: Schema.Types.ObjectId, ref: 'UserMembership', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    action: { type: String, enum: Object.values(MembershipAction), required: true },
    
    previousPlanId: { type: Schema.Types.ObjectId, ref: 'MembershipPlan' },
    newPlanId: { type: Schema.Types.ObjectId, ref: 'MembershipPlan' },
    
    notes: { type: String },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const MembershipHistory = mongoose.model<IMembershipHistory>('MembershipHistory', membershipHistorySchema);
