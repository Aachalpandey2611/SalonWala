import mongoose, { Document, Schema } from 'mongoose';

export enum TransferStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface IStockTransfer extends Document {
  salonId: mongoose.Types.ObjectId;
  
  originBranchId: mongoose.Types.ObjectId;
  destinationBranchId: mongoose.Types.ObjectId;
  
  transferNumber: string;
  
  requestedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  
  status: TransferStatus;
  
  items: Array<{
    productId: mongoose.Types.ObjectId;
    requestedQuantity: number;
    approvedQuantity: number;
    receivedQuantity: number;
  }>;
  
  dispatchDate?: Date;
  receiptDate?: Date;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const stockTransferSchema = new Schema<IStockTransfer>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    originBranchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    destinationBranchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    
    transferNumber: { type: String, required: true, unique: true },
    
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    
    status: { type: String, enum: Object.values(TransferStatus), default: TransferStatus.PENDING, index: true },
    
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
        requestedQuantity: { type: Number, required: true, min: 1 },
        approvedQuantity: { type: Number, default: 0, min: 0 },
        receivedQuantity: { type: Number, default: 0, min: 0 }
      }
    ],
    
    dispatchDate: { type: Date },
    receiptDate: { type: Date },
    
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

export const StockTransfer = mongoose.model<IStockTransfer>('StockTransfer', stockTransferSchema);
