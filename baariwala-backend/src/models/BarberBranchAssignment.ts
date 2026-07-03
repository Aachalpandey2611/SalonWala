import mongoose, { Document, Schema } from 'mongoose';

export enum AssignmentType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  TEMPORARY = 'TEMPORARY',
}

export interface IBarberBranchAssignment extends Document {
  barberId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId; // Denormalized for security checks
  
  assignmentType: AssignmentType;
  isActive: boolean;
  
  // For temporary assignments
  validFrom?: Date;
  validTo?: Date;
  
  assignedBy: mongoose.Types.ObjectId; // User ID
  createdAt: Date;
  updatedAt: Date;
}

const barberBranchAssignmentSchema = new Schema<IBarberBranchAssignment>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    assignmentType: { type: String, enum: Object.values(AssignmentType), default: AssignmentType.SECONDARY },
    isActive: { type: Boolean, default: true },
    
    validFrom: { type: Date },
    validTo: { type: Date },
    
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active assignments to the exact same branch
barberBranchAssignmentSchema.index({ barberId: 1, branchId: 1 }, { unique: true });

export const BarberBranchAssignment = mongoose.model<IBarberBranchAssignment>('BarberBranchAssignment', barberBranchAssignmentSchema);
