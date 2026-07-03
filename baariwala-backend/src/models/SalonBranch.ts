import mongoose, { Document, Schema } from 'mongoose';

export enum BranchStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED_TEMPORARILY = 'CLOSED_TEMPORARILY',
  CLOSED_PERMANENTLY = 'CLOSED_PERMANENTLY',
}

export interface ISalonBranch extends Document {
  salonId: mongoose.Types.ObjectId;
  name: string;
  branchCode: string; // Unique string
  phone: string;
  email?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  timezone: string;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const salonBranchSchema = new Schema<ISalonBranch>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    name: { type: String, required: true, trim: true },
    branchCode: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    pincode: { type: String, required: true },
    timezone: { type: String, default: 'Asia/Kolkata' },
    status: { type: String, enum: Object.values(BranchStatus), default: BranchStatus.INACTIVE },
  },
  {
    timestamps: true,
  }
);

salonBranchSchema.index({ location: '2dsphere' });

export const SalonBranch = mongoose.model<ISalonBranch>('SalonBranch', salonBranchSchema);
