import mongoose, { Document, Schema } from 'mongoose';
import { SettlementStatus } from './Settlement';

export interface ISettlementHistory extends Document {
  settlementId: mongoose.Types.ObjectId;
  
  action: string;
  previousStatus?: SettlementStatus;
  newStatus?: SettlementStatus;
  
  notes?: string;
  initiatedBy?: mongoose.Types.ObjectId;
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const settlementHistorySchema = new Schema<ISettlementHistory>(
  {
    settlementId: { type: Schema.Types.ObjectId, ref: 'Settlement', required: true, index: true },
    
    action: { type: String, required: true },
    previousStatus: { type: String },
    newStatus: { type: String },
    
    notes: { type: String },
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const SettlementHistory = mongoose.model<ISettlementHistory>('SettlementHistory', settlementHistorySchema);
