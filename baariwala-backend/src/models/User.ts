import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../constants/roles';
import { AccountStatus } from '../constants/status';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  googleId?: string;
  refreshToken?: string;
  status: AccountStatus;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, sparse: true, unique: true, trim: true },
    password: { type: String, select: false },
    avatar: { type: String },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    googleId: { type: String, sparse: true, unique: true },
    refreshToken: { type: String, select: false },
    status: { type: String, enum: Object.values(AccountStatus), default: AccountStatus.ACTIVE },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
