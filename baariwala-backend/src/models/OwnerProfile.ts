import mongoose, { Document, Schema } from 'mongoose';

export interface IOwnerProfile extends Document {
  user: mongoose.Types.ObjectId;
  companyName: string;
  gstNumber?: string;
  businessRegistration?: string;
  salonIds: mongoose.Types.ObjectId[];
  verificationDocuments: string[]; // Cloudinary URLs
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInformation: {
    primaryPhone: string;
    secondaryPhone?: string;
    supportEmail?: string;
  };
  bankDetails?: {
    // Encrypted string representing bank details, or separated fields
    accountNumberEncrypted: string;
    ifscCode: string;
    bankName: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const ownerProfileSchema = new Schema<IOwnerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, trim: true, required: true },
    gstNumber: { type: String, trim: true },
    businessRegistration: { type: String, trim: true },
    salonIds: [{ type: Schema.Types.ObjectId, ref: 'Salon' }], // Reference to future Salon model
    verificationDocuments: [{ type: String }],
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    contactInformation: {
      primaryPhone: { type: String, required: true },
      secondaryPhone: { type: String },
      supportEmail: { type: String },
    },
    bankDetails: {
      accountNumberEncrypted: { type: String }, // Would encrypt before saving
      ifscCode: { type: String },
      bankName: { type: String },
    },
    verificationStatus: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    completionPercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const OwnerProfile = mongoose.model<IOwnerProfile>('OwnerProfile', ownerProfileSchema);
