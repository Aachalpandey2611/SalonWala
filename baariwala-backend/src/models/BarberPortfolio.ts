import mongoose, { Document, Schema } from 'mongoose';

export enum PortfolioCategory {
  BEFORE_AND_AFTER = 'BEFORE_AND_AFTER',
  HAIRCUTS = 'HAIRCUTS',
  BEARD_STYLES = 'BEARD_STYLES',
  HAIR_COLORING = 'HAIR_COLORING',
  FACIALS = 'FACIALS',
  SPA = 'SPA',
  PREMIUM_STYLING = 'PREMIUM_STYLING',
  OTHER = 'OTHER',
}

export interface IBarberPortfolio extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  category: PortfolioCategory;
  imageUrl: string; // Cloudinary URL
  publicId?: string; // Cloudinary Public ID for deletion
  caption?: string;
  displayOrder: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberPortfolioSchema = new Schema<IBarberPortfolio>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    category: { type: String, enum: Object.values(PortfolioCategory), default: PortfolioCategory.OTHER },
    imageUrl: { type: String, required: true },
    publicId: { type: String },
    caption: { type: String, trim: true, maxlength: 200 },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const BarberPortfolio = mongoose.model<IBarberPortfolio>('BarberPortfolio', barberPortfolioSchema);
