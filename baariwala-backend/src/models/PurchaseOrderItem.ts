import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchaseOrderItem extends Document {
  purchaseOrderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId; // E.g., Shampoo, Color Tube
  
  expectedQuantity: number;
  receivedQuantity: number;
  
  unitPrice: number;
  discount: number;
  tax: number; // Percentage or flat amount
  gst: number;
  
  netAmount: number; // (unitPrice * expectedQuantity) - discount + tax + gst
  
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>(
  {
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true }, // Assumes InventoryItem exists from earlier modules
    
    expectedQuantity: { type: Number, required: true, min: 1 },
    receivedQuantity: { type: Number, default: 0 },
    
    unitPrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    
    netAmount: { type: Number, required: true }
  },
  {
    timestamps: true,
  }
);

export const PurchaseOrderItem = mongoose.model<IPurchaseOrderItem>('PurchaseOrderItem', purchaseOrderItemSchema);
