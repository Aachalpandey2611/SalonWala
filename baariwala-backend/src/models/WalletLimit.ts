import mongoose, { Document, Schema } from 'mongoose';

export interface IWalletLimit extends Document {
  customerLevel: string; // E.g. 'STANDARD', 'PREMIUM', 'KYC_VERIFIED'
  
  maxWalletBalance: number;
  maxDailyCredit: number;
  maxDailyDebit: number;
  maxSingleTransaction: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const walletLimitSchema = new Schema<IWalletLimit>(
  {
    customerLevel: { type: String, required: true, unique: true, index: true },
    
    maxWalletBalance: { type: Number, required: true, default: 10000 },
    maxDailyCredit: { type: Number, required: true, default: 5000 },
    maxDailyDebit: { type: Number, required: true, default: 5000 },
    maxSingleTransaction: { type: Number, required: true, default: 2000 },
  },
  {
    timestamps: true,
  }
);

export const WalletLimit = mongoose.model<IWalletLimit>('WalletLimit', walletLimitSchema);
