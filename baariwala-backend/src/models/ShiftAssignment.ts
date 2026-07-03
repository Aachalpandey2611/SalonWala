import mongoose, { Document, Schema } from 'mongoose';

export interface IShiftAssignment extends Document {
  salonId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  shiftId: mongoose.Types.ObjectId;
  
  startDate: Date;
  endDate?: Date; // If null, it's indefinitely assigned
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const shiftAssignmentSchema = new Schema<IShiftAssignment>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    shiftId: { type: Schema.Types.ObjectId, ref: 'AttendanceShift', required: true },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Optimize query for active assignments
shiftAssignmentSchema.index({ employeeId: 1, isActive: 1 });

export const ShiftAssignment = mongoose.model<IShiftAssignment>('ShiftAssignment', shiftAssignmentSchema);
