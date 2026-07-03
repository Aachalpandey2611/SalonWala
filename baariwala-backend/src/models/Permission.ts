import mongoose, { Document, Schema } from 'mongoose';

export enum DataScope {
  SELF = 'SELF', // e.g. View my own bookings
  BRANCH = 'BRANCH', // e.g. View all bookings in my assigned branch
  ORGANIZATION = 'ORGANIZATION', // e.g. View all bookings in my franchise
  TENANT = 'TENANT', // e.g. View everything in the company
  GLOBAL = 'GLOBAL' // e.g. SuperAdmin
}

export interface IPermission extends Document {
  code: string; // The canonical code used in code guards: e.g. "booking.create.branch"
  
  module: string; // e.g. "booking"
  action: string; // e.g. "create"
  scope: DataScope; // e.g. "BRANCH"
  
  description: string;
  groupId: mongoose.Types.ObjectId; // Link to PermissionGroup
  
  isSystem: boolean; // Immutable by standard admins
  
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    code: { type: String, required: true, unique: true },
    
    module: { type: String, required: true },
    action: { type: String, required: true },
    scope: { type: String, enum: Object.values(DataScope), required: true },
    
    description: { type: String, required: true },
    groupId: { type: Schema.Types.ObjectId, ref: 'PermissionGroup', required: true },
    
    isSystem: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Optimize exact-match lookups
permissionSchema.index({ code: 1 });
permissionSchema.index({ module: 1, action: 1 });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);
