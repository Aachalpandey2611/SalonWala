import mongoose, { Document, Schema } from 'mongoose';

export interface ISalonAmenities extends Document {
  branchId: mongoose.Types.ObjectId;
  parking: boolean;
  wifi: boolean;
  upi: boolean;
  card: boolean;
  ac: boolean;
  waitingArea: boolean;
  wheelchairAccess: boolean;
  coffee: boolean;
  water: boolean;
  washroom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const salonAmenitiesSchema = new Schema<ISalonAmenities>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, unique: true },
    parking: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    upi: { type: Boolean, default: false },
    card: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    waitingArea: { type: Boolean, default: false },
    wheelchairAccess: { type: Boolean, default: false },
    coffee: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    washroom: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const SalonAmenities = mongoose.model<ISalonAmenities>('SalonAmenities', salonAmenitiesSchema);
