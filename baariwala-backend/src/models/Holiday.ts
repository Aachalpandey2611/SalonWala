import mongoose, { Document, Schema } from 'mongoose';

export enum HolidayType {
  FESTIVAL = 'FESTIVAL',
  EMERGENCY = 'EMERGENCY',
  MAINTENANCE = 'MAINTENANCE',
  WEEKLY_OFF = 'WEEKLY_OFF',
}

export enum EmergencyReason {
  POWER_FAILURE = 'POWER_FAILURE',
  EMERGENCY = 'EMERGENCY',
  MEDICAL = 'MEDICAL',
  MAINTENANCE = 'MAINTENANCE',
  WEATHER = 'WEATHER',
  OTHER = 'OTHER',
}

export interface IHoliday extends Document {
  branchId?: mongoose.Types.ObjectId; // If null, applies to entire Salon
  salonId: mongoose.Types.ObjectId; // Always present
  type: HolidayType;
  emergencyReason?: EmergencyReason; // Only if type is EMERGENCY
  reason: string;
  date: Date;
  isRecurring: boolean; // Repeat every year
  createdAt: Date;
  updatedAt: Date;
}

const holidaySchema = new Schema<IHoliday>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    type: { type: String, enum: Object.values(HolidayType), required: true },
    emergencyReason: { type: String, enum: Object.values(EmergencyReason) },
    reason: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    isRecurring: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// We can index on date to quickly query holidays
holidaySchema.index({ salonId: 1, date: 1 });

export const Holiday = mongoose.model<IHoliday>('Holiday', holidaySchema);
