import mongoose, { Document, Schema } from 'mongoose';

export enum InventoryAuditAction {
  STOCK_RECEIVED = 'STOCK_RECEIVED',
  STOCK_CONSUMED = 'STOCK_CONSUMED',
  STOCK_ADJUSTED = 'STOCK_ADJUSTED',
  STOCK_TRANSFERRED = 'STOCK_TRANSFERRED'
}

export interface IInventoryAudit extends Document {
  inventoryId: mongoose.Types.ObjectId; // References Inventory
  movementId?: mongoose.Types.ObjectId; // References InventoryMovement
  
  action: InventoryAuditAction;
  
  previousAvailableStock: number;
  newAvailableStock: number;
  
  initiatedBy: mongoose.Types.ObjectId; // User ID
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const inventoryAuditSchema = new Schema<IInventoryAudit>(
  {
    inventoryId: { type: Schema.Types.ObjectId, ref: 'Inventory', required: true, index: true },
    movementId: { type: Schema.Types.ObjectId, ref: 'InventoryMovement' },
    
    action: { type: String, enum: Object.values(InventoryAuditAction), required: true, index: true },
    
    previousAvailableStock: { type: Number, required: true },
    newAvailableStock: { type: Number, required: true },
    
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const InventoryAudit = mongoose.model<IInventoryAudit>('InventoryAudit', inventoryAuditSchema);
