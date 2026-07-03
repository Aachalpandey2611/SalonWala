import mongoose, { Document, Schema } from 'mongoose';

export enum VerificationDocStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IBusinessVerification extends Document {
  salonId: mongoose.Types.ObjectId;
  gstDocumentUrl?: string; // Cloudinary
  registrationDocumentUrl?: string;
  addressProofUrl?: string;
  identityProofUrl?: string;
  status: VerificationDocStatus;
  adminRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const businessVerificationSchema = new Schema<IBusinessVerification>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, unique: true },
    gstDocumentUrl: { type: String },
    registrationDocumentUrl: { type: String },
    addressProofUrl: { type: String },
    identityProofUrl: { type: String },
    status: { type: String, enum: Object.values(VerificationDocStatus), default: VerificationDocStatus.PENDING },
    adminRemarks: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const BusinessVerification = mongoose.model<IBusinessVerification>('BusinessVerification', businessVerificationSchema);
