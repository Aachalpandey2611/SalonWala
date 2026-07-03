import mongoose, { Document, Schema } from 'mongoose';

export interface IBarberProfile extends Document {
  user: mongoose.Types.ObjectId;
  experience?: number; // In years
  bio?: string;
  skills: string[];
  certifications: string[];
  languages: string[];
  availability: {
    start: string; // e.g., '09:00'
    end: string; // e.g., '18:00'
  };
  workingDays: string[]; // e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  leaveDates: Date[];
  currentSalon?: mongoose.Types.ObjectId;
  rating: number;
  completedAppointments: number;
  portfolioImages: string[]; // URLs from Cloudinary
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const barberProfileSchema = new Schema<IBarberProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    experience: { type: Number, min: 0 },
    bio: { type: String, maxlength: 500, trim: true },
    skills: [{ type: String }],
    certifications: [{ type: String }],
    languages: [{ type: String, default: 'English' }],
    availability: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' },
    },
    workingDays: [{ type: String, enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }],
    leaveDates: [{ type: Date }],
    currentSalon: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    completedAppointments: { type: Number, default: 0 },
    portfolioImages: [{ type: String }],
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    completionPercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const BarberProfile = mongoose.model<IBarberProfile>('BarberProfile', barberProfileSchema);
