import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress {
  label: string; // e.g. Home, Work
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface ICustomerProfile extends Document {
  user: mongoose.Types.ObjectId;
  firstName?: string;
  lastName?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: Date;
  alternatePhone?: string;
  addresses: IAddress[];
  preferredLanguage?: string;
  walletBalance: number;
  rewardPoints: number;
  favoriteBarbers: mongoose.Types.ObjectId[];
  favoriteSalons: mongoose.Types.ObjectId[];
  preferredServices: string[];
  notificationSettings: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacySettings: {
    hidePhone: boolean;
    hideEmail: boolean;
  };
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  isDefault: { type: Boolean, default: false },
});

const customerProfileSchema = new Schema<ICustomerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    alternatePhone: { type: String, trim: true },
    addresses: [addressSchema],
    preferredLanguage: { type: String, default: 'English' },
    walletBalance: { type: Number, default: 0 },
    rewardPoints: { type: Number, default: 0 },
    favoriteBarbers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    favoriteSalons: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Assuming owners map to salons, or we have a Salon model later
    preferredServices: [{ type: String }],
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    privacySettings: {
      hidePhone: { type: Boolean, default: false },
      hideEmail: { type: Boolean, default: false },
    },
    completionPercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CustomerProfile = mongoose.model<ICustomerProfile>('CustomerProfile', customerProfileSchema);
