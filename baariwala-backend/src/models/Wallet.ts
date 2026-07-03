import mongoose, { Document, Schema } from 'mongoose';

export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  FROZEN = 'FROZEN',
  BLOCKED = 'BLOCKED',
  CLOSED = 'CLOSED',
  SUSPENDED = 'SUSPENDED'
}

export interface IWallet extends Document {
  customerId: mongoose.Types.ObjectId; // References User
  
  status: WalletStatus;
  
  // Balance is strictly a cache from the Ledger!
  // It is updated asynchronously when a LedgerEntry is created.
  currentBalance: number;
  currency: string;
  
  lastActivity: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    
    status: { type: String, enum: Object.values(WalletStatus), default: WalletStatus.ACTIVE, index: true },
    
    currentBalance: { type: Number, default: 0, min: 0 },
    currency: { type: String, required: true, default: 'INR' },
    
    lastActivity: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
