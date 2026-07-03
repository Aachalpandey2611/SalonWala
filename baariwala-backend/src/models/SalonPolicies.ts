import mongoose, { Document, Schema } from 'mongoose';

export interface ISalonPolicies extends Document {
  branchId: mongoose.Types.ObjectId;
  cancellationPolicy: string;
  refundPolicy: string;
  lateArrivalPolicy: string;
  childrenPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

const salonPoliciesSchema = new Schema<ISalonPolicies>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, unique: true },
    cancellationPolicy: { type: String, trim: true, default: '' },
    refundPolicy: { type: String, trim: true, default: '' },
    lateArrivalPolicy: { type: String, trim: true, default: '' },
    childrenPolicy: { type: String, trim: true, default: '' },
  },
  {
    timestamps: true,
  }
);

export const SalonPolicies = mongoose.model<ISalonPolicies>('SalonPolicies', salonPoliciesSchema);
