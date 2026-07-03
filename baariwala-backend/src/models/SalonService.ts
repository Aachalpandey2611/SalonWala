import mongoose, { Document, Schema } from 'mongoose';

export enum ServiceStatus {
  AVAILABLE = 'AVAILABLE',
  HIDDEN = 'HIDDEN',
  TEMPORARILY_DISABLED = 'TEMPORARILY_DISABLED',
  SEASONAL = 'SEASONAL',
  COMING_SOON = 'COMING_SOON',
}

export enum GenderAvailability {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
  KIDS = 'KIDS',
}

export interface ISalonService extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  displayImage?: string; // Cloudinary URL
  status: ServiceStatus;
  
  // Duration Engine
  durationInMinutes: number;
  preparationTimeInMinutes: number;
  cleanupTimeInMinutes: number;
  totalCalculatedDuration: number; // Prep + Duration + Cleanup

  // Pricing (Defaults)
  basePrice: number;
  currency: string;
  gstPercentage: number;
  
  // Requirements
  minimumBarberSkill?: string; // e.g., 'Senior', 'Master'
  requiredExperienceInYears?: number;
  maximumCapacity: number; // For group services, usually 1
  
  // Demographics
  genderAvailability: GenderAvailability;
  minimumAge?: number;
  maximumAge?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const salonServiceSchema = new Schema<ISalonService>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    displayImage: { type: String },
    status: { type: String, enum: Object.values(ServiceStatus), default: ServiceStatus.AVAILABLE },
    
    durationInMinutes: { type: Number, required: true, min: 1 },
    preparationTimeInMinutes: { type: Number, default: 0, min: 0 },
    cleanupTimeInMinutes: { type: Number, default: 0, min: 0 },
    totalCalculatedDuration: { type: Number, required: true },
    
    basePrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    gstPercentage: { type: Number, default: 18, min: 0, max: 100 },
    
    minimumBarberSkill: { type: String, trim: true },
    requiredExperienceInYears: { type: Number, min: 0 },
    maximumCapacity: { type: Number, default: 1, min: 1 },
    
    genderAvailability: { type: String, enum: Object.values(GenderAvailability), default: GenderAvailability.UNISEX },
    minimumAge: { type: Number, min: 0 },
    maximumAge: { type: Number, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Auto calculate total duration before saving
salonServiceSchema.pre('save', async function () {
  this.totalCalculatedDuration = this.preparationTimeInMinutes + this.durationInMinutes + this.cleanupTimeInMinutes;
});

// Prevent duplicate service names in the same branch
salonServiceSchema.index({ branchId: 1, name: 1 }, { unique: true });

export const SalonService = mongoose.model<ISalonService>('SalonService', salonServiceSchema);
