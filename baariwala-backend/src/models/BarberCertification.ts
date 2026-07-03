import mongoose, { Document, Schema } from 'mongoose';

export enum CertificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export interface IBarberCertification extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  certificateName: string;
  issuedBy: string;
  issueDate: Date;
  expiryDate?: Date;
  
  certificateImageUrl: string; // Cloudinary URL
  
  status: CertificationStatus;
  verifiedBy?: mongoose.Types.ObjectId; // User ID
  verifiedDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberCertificationSchema = new Schema<IBarberCertification>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    certificateName: { type: String, required: true, trim: true },
    issuedBy: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    
    certificateImageUrl: { type: String, required: true },
    
    status: { type: String, enum: Object.values(CertificationStatus), default: CertificationStatus.PENDING },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const BarberCertification = mongoose.model<IBarberCertification>('BarberCertification', barberCertificationSchema);
