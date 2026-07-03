import mongoose, { Document, Schema } from 'mongoose';

export enum MovementType {
  PURCHASE = 'PURCHASE',
  CONSUMPTION = 'CONSUMPTION',
  SALE = 'SALE',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  DAMAGE = 'DAMAGE',
  EXPIRED = 'EXPIRED',
  TRANSFER_OUT = 'TRANSFER_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  RETURN = 'RETURN'
}

export interface IInventoryMovement extends Document {
  inventoryId: mongoose.Types.ObjectId; // References Inventory
  productId: mongoose.Types.ObjectId;   // References Product (denormalized for easy querying)
  branchId: mongoose.Types.ObjectId;    // References SalonBranch (denormalized)
  
  movementType: MovementType;
  
  quantity: number; // Positive for IN, Negative for OUT
  
  referenceId?: mongoose.Types.ObjectId; // Could be PurchaseOrderID, AppointmentID, TransferID
  reason?: string;
  
  initiatedBy: mongoose.Types.ObjectId; // User ID
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const inventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    movementType: { type: String, enum: Object.values(MovementType), required: true, index: true },
    
    quantity: { type: Number, required: true },
    
    referenceId: { type: Schema.Types.ObjectId, index: true },
    reason: { type: String },
    
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const InventoryMovement = mongoose.model<IInventoryMovement>('InventoryMovement', inventoryMovementSchema);
