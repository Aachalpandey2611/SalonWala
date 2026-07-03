import mongoose, { Document, Schema } from 'mongoose';

export enum DayOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export interface ITimeSession {
  openTime: string; // e.g., '09:00'
  closeTime: string; // e.g., '13:00'
}

export interface IBusinessHours extends Document {
  branchId: mongoose.Types.ObjectId;
  day: DayOfWeek;
  isClosed: boolean;
  sessions: ITimeSession[];
}

const timeSessionSchema = new Schema<ITimeSession>(
  {
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
  },
  { _id: false }
);

const businessHoursSchema = new Schema<IBusinessHours>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    isClosed: { type: Boolean, default: false },
    sessions: [timeSessionSchema], // Multiple sessions naturally supports lunch breaks
  },
  {
    timestamps: true,
  }
);

// Ensure only one record per day per branch
businessHoursSchema.index({ branchId: 1, day: 1 }, { unique: true });

export const BusinessHours = mongoose.model<IBusinessHours>('BusinessHours', businessHoursSchema);
