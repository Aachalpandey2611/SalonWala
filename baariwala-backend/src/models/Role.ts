import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string; // e.g. "Senior Barber", "Franchise Owner"
  description: string;
  
  // Strict Isolation: If tenantId is null, it's a Global System Role (like Platform Admin)
  tenantId?: mongoose.Types.ObjectId; 
  branchId?: mongoose.Types.ObjectId; // Custom branch-specific roles
  
  permissions: mongoose.Types.ObjectId[]; // Array of IPermission IDs
  
  isSystem: boolean; // Immutable by standard admins
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    description: { type: String },
    
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    
    isSystem: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Roles must be unique per tenant
roleSchema.index({ name: 1, tenantId: 1 }, { unique: true });

export const Role = mongoose.model<IRole>('Role', roleSchema);
