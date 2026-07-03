import mongoose, { Document, Schema } from 'mongoose';

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface IBarberSkill extends Document {
  barberId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId; // References SalonService
  salonId: mongoose.Types.ObjectId;
  
  skillLevel: SkillLevel;
  yearsOfExperience: number;
  internalNotes?: string;
  
  isVerified: boolean;
  verifiedBy?: mongoose.Types.ObjectId; // User ID who verified
  verifiedDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberSkillSchema = new Schema<IBarberSkill>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    skillLevel: { type: String, enum: Object.values(SkillLevel), default: SkillLevel.INTERMEDIATE },
    yearsOfExperience: { type: Number, default: 0, min: 0 },
    internalNotes: { type: String, trim: true, maxlength: 500 },
    
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent a barber from having duplicate skills for the exact same service
barberSkillSchema.index({ barberId: 1, serviceId: 1 }, { unique: true });

export const BarberSkill = mongoose.model<IBarberSkill>('BarberSkill', barberSkillSchema);
