import mongoose, { Document, Schema } from 'mongoose';

export interface IConsumptionItem {
  productId: mongoose.Types.ObjectId; // References Product
  quantity: number; // The amount consumed (e.g., 30ml)
}

export interface IProductConsumptionRule extends Document {
  serviceId: mongoose.Types.ObjectId; // References SalonService
  
  items: IConsumptionItem[];
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const consumptionItemSchema = new Schema<IConsumptionItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 0.01 }, // Can consume fractional units like 0.5 pieces
});

const productConsumptionRuleSchema = new Schema<IProductConsumptionRule>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, unique: true, index: true },
    
    items: [consumptionItemSchema],
    
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ProductConsumptionRule = mongoose.model<IProductConsumptionRule>('ProductConsumptionRule', productConsumptionRuleSchema);
