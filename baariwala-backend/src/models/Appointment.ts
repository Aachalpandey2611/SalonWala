import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  WAITING = 'WAITING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED_BY_CUSTOMER = 'CANCELLED_BY_CUSTOMER',
  CANCELLED_BY_SALON = 'CANCELLED_BY_SALON',
  NO_SHOW = 'NO_SHOW',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  RESCHEDULED = 'RESCHEDULED',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUND_COMPLETED = 'REFUND_COMPLETED',
}

export enum BookingSource {
  APP = 'APP',
  WALK_IN = 'WALK_IN',
  ADMIN = 'ADMIN',
}

export interface IAppointment extends Document {
  bookingNumber: string; // E.g., BWAL-123456
  
  customerId: mongoose.Types.ObjectId; // References User
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  barberId: mongoose.Types.ObjectId;
  
  primaryServiceId: mongoose.Types.ObjectId;
  selectedAddons: mongoose.Types.ObjectId[]; // Array of ServiceAddon IDs
  
  appointmentDate: Date; // YYYY-MM-DD
  appointmentStartTime: string; // HH:MM
  appointmentEndTime: string;   // HH:MM
  reservedDurationInMinutes: number;
  
  bookedPrice: number;
  appliedTax: number;
  appliedDiscounts: number;
  
  source: BookingSource;
  status: BookingStatus;
  
  notesId?: mongoose.Types.ObjectId; // References AppointmentNotes
  
  // Lifecycle fields
  checkInTime?: Date;
  checkedInBy?: mongoose.Types.ObjectId;
  checkInMethod?: string;
  
  serviceStartTime?: Date;
  startedBy?: mongoose.Types.ObjectId;
  
  serviceCompletionTime?: Date;
  completedBy?: mongoose.Types.ObjectId;
  completionNotes?: string;
  actualDurationInMinutes?: number;
  
  cancellationReason?: string;
  cancelledBy?: mongoose.Types.ObjectId;
  
  createdBy: mongoose.Types.ObjectId; // User ID who made the booking
  
  isDeleted: boolean; // Soft delete
  
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    bookingNumber: { type: String, required: true, unique: true, index: true },
    
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    
    primaryServiceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true },
    selectedAddons: [{ type: Schema.Types.ObjectId, ref: 'ServiceAddon' }],
    
    appointmentDate: { type: Date, required: true },
    appointmentStartTime: { type: String, required: true },
    appointmentEndTime: { type: String, required: true },
    reservedDurationInMinutes: { type: Number, required: true, min: 1 },
    
    bookedPrice: { type: Number, required: true, min: 0 },
    appliedTax: { type: Number, default: 0, min: 0 },
    appliedDiscounts: { type: Number, default: 0, min: 0 },
    
    source: { type: String, enum: Object.values(BookingSource), required: true },
    status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING, index: true },
    
    notesId: { type: Schema.Types.ObjectId, ref: 'AppointmentNotes' },
    
    // Lifecycle fields
    checkInTime: { type: Date },
    checkedInBy: { type: Schema.Types.ObjectId, ref: 'User' },
    checkInMethod: { type: String, enum: ['QR', 'OTP', 'MANUAL', 'WALK_IN'] },
    
    serviceStartTime: { type: Date },
    startedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    
    serviceCompletionTime: { type: Date },
    completedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    completionNotes: { type: String, trim: true },
    actualDurationInMinutes: { type: Number, min: 1 },
    
    cancellationReason: { type: String, trim: true },
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate bookings at the exact same time for the same customer or barber
// (Though availability engine handles barber, this is a safety net)
appointmentSchema.index({ barberId: 1, appointmentDate: 1, appointmentStartTime: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
