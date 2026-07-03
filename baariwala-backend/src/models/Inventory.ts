import mongoose, { Document, Schema } from 'mongoose';

export interface IInventory extends Document {
  productId: mongoose.Types.ObjectId; // References Product
  branchId: mongoose.Types.ObjectId;  // References SalonBranch
  
  availableStock: number;
  reservedStock: number; // Stock reserved for upcoming bookings
  
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  
  batchNumber?: string;
  expiryDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    availableStock: { type: Number, required: true, default: 0 },
    reservedStock: { type: Number, required: true, default: 0, min: 0 },
    
    minimumStock: { type: Number, required: true, default: 10, min: 0 },
    maximumStock: { type: Number, required: true, default: 1000, min: 0 },
    reorderLevel: { type: Number, required: true, default: 20, min: 0 },
    
    batchNumber: { type: String },
    expiryDate: { type: Date },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ productId: 1, branchId: 1, batchNumber: 1 }, { unique: true });

export const Inventory = mongoose.model<IInventory>('Inventory', inventorySchema);
