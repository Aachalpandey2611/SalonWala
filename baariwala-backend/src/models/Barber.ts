import mongoose, { Document, Schema } from 'mongoose';

export enum BarberEmploymentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
  TRAINING = 'TRAINING',
}

export enum BarberVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface IBarber extends Document {
  employeeCode: string;
  userId?: mongoose.Types.ObjectId; // Optional: Some barbers might not have an app account initially
  salonId: mongoose.Types.ObjectId;
  defaultBranchId: mongoose.Types.ObjectId; // Primary branch assignment
  
  firstName: string;
  lastName: string;
  profilePhoto?: string; // Cloudinary URL
  phone: string;
  email?: string;
  gender: string;
  dateOfBirth?: Date;
  joiningDate: Date;
  experienceInYears: number;
  biography?: string;
  languagesSpoken: string[];
  
  employmentStatus: BarberEmploymentStatus;
  verificationStatus: BarberVerificationStatus;
  
  // Cumulative Performance Metrics (Updated by Analytics Engine in the future)
  averageRating: number;
  totalReviews: number;
  completedAppointments: number;
  totalRevenueGenerated: number;
  averageServiceDurationInMinutes: number;
  repeatCustomerCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberSchema = new Schema<IBarber>(
  {
    employeeCode: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    defaultBranchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profilePhoto: { type: String },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date },
    joiningDate: { type: Date, default: Date.now },
    experienceInYears: { type: Number, default: 0, min: 0 },
    biography: { type: String, trim: true, maxlength: 1000 },
    languagesSpoken: [{ type: String, trim: true }],
    
    employmentStatus: { type: String, enum: Object.values(BarberEmploymentStatus), default: BarberEmploymentStatus.ACTIVE },
    verificationStatus: { type: String, enum: Object.values(BarberVerificationStatus), default: BarberVerificationStatus.PENDING },
    
    // Performance Metrics (Defaults)
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    completedAppointments: { type: Number, default: 0, min: 0 },
    totalRevenueGenerated: { type: Number, default: 0, min: 0 },
    averageServiceDurationInMinutes: { type: Number, default: 0, min: 0 },
    repeatCustomerCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate employee codes globally (or per salon, let's make it per salon)
barberSchema.index({ salonId: 1, employeeCode: 1 }, { unique: true });

export const Barber = mongoose.model<IBarber>('Barber', barberSchema);
