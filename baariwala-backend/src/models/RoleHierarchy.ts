import mongoose, { Document, Schema } from 'mongoose';

export interface IRoleHierarchy extends Document {
  tenantId?: mongoose.Types.ObjectId; // Strict isolation context
  
  parentRoleId: mongoose.Types.ObjectId; // The role that inherits (e.g. Salon Owner)
  childRoleId: mongoose.Types.ObjectId; // The role being inherited (e.g. Branch Manager)
  
  createdAt: Date;
}

const roleHierarchySchema = new Schema<IRoleHierarchy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    
    parentRoleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    childRoleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

// Prevent circular hierarchy by enforcing unique directional paths
roleHierarchySchema.index({ parentRoleId: 1, childRoleId: 1 }, { unique: true });

export const RoleHierarchy = mongoose.model<IRoleHierarchy>('RoleHierarchy', roleHierarchySchema);
