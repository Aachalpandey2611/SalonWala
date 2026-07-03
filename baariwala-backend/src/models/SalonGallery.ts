import mongoose, { Document, Schema } from 'mongoose';

export enum GalleryImageType {
  INTERIOR = 'INTERIOR',
  EXTERIOR = 'EXTERIOR',
  TEAM = 'TEAM',
  SHOP = 'SHOP',
}

export interface ISalonGallery extends Document {
  branchId: mongoose.Types.ObjectId;
  images: {
    url: string; // Cloudinary URL
    publicId: string;
  }[];
  type: GalleryImageType;
  createdAt: Date;
  updatedAt: Date;
}

const salonGallerySchema = new Schema<ISalonGallery>(
  {
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    type: { type: String, enum: Object.values(GalleryImageType), required: true },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One type per branch
salonGallerySchema.index({ branchId: 1, type: 1 }, { unique: true });

export const SalonGallery = mongoose.model<ISalonGallery>('SalonGallery', salonGallerySchema);
