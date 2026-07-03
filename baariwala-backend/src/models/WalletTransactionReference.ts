import mongoose, { Document, Schema } from 'mongoose';

export enum WalletOperationType {
  RECHARGE = 'RECHARGE',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  REFERRAL_CREDIT = 'REFERRAL_CREDIT',
  PROMO_CREDIT = 'PROMO_CREDIT',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT'
}

export interface IWalletTransactionReference extends Document {
  walletId: mongoose.Types.ObjectId; // References Wallet
  journalId: mongoose.Types.ObjectId; // References LedgerJournal (The source of truth)
  
  operationType: WalletOperationType;
  
  amount: number;
  direction: 'CREDIT' | 'DEBIT';
  
  metadata?: any;
  
  createdAt: Date;
}

const walletTransactionReferenceSchema = new Schema<IWalletTransactionReference>(
  {
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    journalId: { type: Schema.Types.ObjectId, ref: 'LedgerJournal', required: true, index: true, unique: true },
    
    operationType: { type: String, enum: Object.values(WalletOperationType), required: true, index: true },
    
    amount: { type: Number, required: true, min: 0 },
    direction: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
    
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const WalletTransactionReference = mongoose.model<IWalletTransactionReference>('WalletTransactionReference', walletTransactionReferenceSchema);
