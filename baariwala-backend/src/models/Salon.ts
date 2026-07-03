import mongoose, { Document, Schema } from 'mongoose';

export enum SalonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CLOSED = 'CLOSED',
}

export interface ISalon extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  status: SalonStatus;
  createdAt: Date;
  updatedAt: Date;
}

const salonSchema = new Schema<ISalon>(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: Object.values(SalonStatus), default: SalonStatus.INACTIVE },
  },
  {
    timestamps: true,
  }
);

export const Salon = mongoose.model<ISalon>('Salon', salonSchema);
