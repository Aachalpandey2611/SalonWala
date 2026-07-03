import mongoose, { Document, Schema } from 'mongoose';

export enum CommissionProcessingMode {
  REALTIME = 'REALTIME',
  BATCH = 'BATCH'
}

export interface ICommissionConfiguration extends Document {
  salonId: mongoose.Types.ObjectId;
  
  isEnabled: boolean;
  
  defaultCommissionPercentage: number;
  processingMode: CommissionProcessingMode;
  
  createdAt: Date;
  updatedAt: Date;
}

const commissionConfigurationSchema = new Schema<ICommissionConfiguration>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, unique: true, index: true },
    
    isEnabled: { type: Boolean, default: true },
    
    defaultCommissionPercentage: { type: Number, required: true, min: 0, max: 100, default: 0 },
    processingMode: { type: String, enum: Object.values(CommissionProcessingMode), default: CommissionProcessingMode.REALTIME },
  },
  {
    timestamps: true,
  }
);

export const CommissionConfiguration = mongoose.model<ICommissionConfiguration>('CommissionConfiguration', commissionConfigurationSchema);
