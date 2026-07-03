import mongoose, { Document, Schema } from 'mongoose';

export enum TaxType {
  GST = 'GST',
  REGIONAL = 'REGIONAL',
  OTHER = 'OTHER',
}

export interface IServiceTax extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId; // Null means applies to entire salon
  name: string; // e.g., 'CGST', 'SGST', 'Luxury Tax'
  type: TaxType;
  percentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceTaxSchema = new Schema<IServiceTax>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: Object.values(TaxType), required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ServiceTax = mongoose.model<IServiceTax>('ServiceTax', serviceTaxSchema);
