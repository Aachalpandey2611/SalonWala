import mongoose, { Document, Schema } from 'mongoose';

export interface IPermissionGroup extends Document {
  name: string; // e.g. "Booking Management", "Finance & Billing"
  description: string;
  isSystem: boolean; // Cannot be deleted
  
  createdAt: Date;
  updatedAt: Date;
}

const permissionGroupSchema = new Schema<IPermissionGroup>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    isSystem: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

export const PermissionGroup = mongoose.model<IPermissionGroup>('PermissionGroup', permissionGroupSchema);
