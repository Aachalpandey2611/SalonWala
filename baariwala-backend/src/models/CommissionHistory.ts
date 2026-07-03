import mongoose, { Document, Schema } from 'mongoose';
import { CommissionStatus } from './Commission';

export interface ICommissionHistory extends Document {
  commissionId: mongoose.Types.ObjectId;
  
  previousStatus?: CommissionStatus;
  newStatus: CommissionStatus;
  
  notes?: string;
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const commissionHistorySchema = new Schema<ICommissionHistory>(
  {
    commissionId: { type: Schema.Types.ObjectId, ref: 'Commission', required: true, index: true },
    
    previousStatus: { type: String, enum: Object.values(CommissionStatus) },
    newStatus: { type: String, enum: Object.values(CommissionStatus), required: true },
    
    notes: { type: String },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommissionHistory = mongoose.model<ICommissionHistory>('CommissionHistory', commissionHistorySchema);
