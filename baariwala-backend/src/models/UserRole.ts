import mongoose, { Document, Schema } from 'mongoose';

export interface IUserRole extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  
  // The context where this role is valid
  tenantId?: mongoose.Types.ObjectId; // E.g., Global Tenant Admin
  organizationId?: mongoose.Types.ObjectId; // E.g., Franchise Head
  branchId?: mongoose.Types.ObjectId; // E.g., Branch Manager
  
  createdAt: Date;
  updatedAt: Date;
}

const userRoleSchema = new Schema<IUserRole>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true }
  },
  {
    timestamps: true,
  }
);

export const UserRole = mongoose.model<IUserRole>('UserRole', userRoleSchema);
