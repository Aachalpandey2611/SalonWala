import mongoose, { Document, Schema } from 'mongoose';

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IServiceCategory extends Document {
  salonId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  icon?: string; // Cloudinary URL
  displayOrder: number;
  status: CategoryStatus;
  visibility: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
    icon: { type: String },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(CategoryStatus), default: CategoryStatus.ACTIVE },
    visibility: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names in the same salon
serviceCategorySchema.index({ salonId: 1, name: 1 }, { unique: true });

export const ServiceCategory = mongoose.model<IServiceCategory>('ServiceCategory', serviceCategorySchema);
