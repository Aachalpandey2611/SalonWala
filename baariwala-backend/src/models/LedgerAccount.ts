import mongoose, { Document, Schema } from 'mongoose';

export enum AccountType {
  ASSET = 'ASSET',         // e.g., System Bank Account, Cash in transit
  LIABILITY = 'LIABILITY', // e.g., Customer Wallet Balance, Payable to Salon
  REVENUE = 'REVENUE',     // e.g., Salon Revenue, Platform Commission
  EXPENSE = 'EXPENSE',     // e.g., Marketing, Discounts Given
  EQUITY = 'EQUITY'        // Owner's equity
}

export enum AccountOwnerType {
  SYSTEM = 'SYSTEM',
  CUSTOMER = 'CUSTOMER',
  SALON = 'SALON'
}

export interface ILedgerAccount extends Document {
  code: string;           // e.g., 'SYS_CASH_01'
  name: string;           // e.g., 'System Cash Clearing Account'
  
  accountType: AccountType;
  ownerType: AccountOwnerType;
  
  ownerId?: mongoose.Types.ObjectId; // Customer ID or Salon ID. Null for System accounts.
  
  currency: string;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ledgerAccountSchema = new Schema<ILedgerAccount>(
  {
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    
    accountType: { type: String, enum: Object.values(AccountType), required: true, index: true },
    ownerType: { type: String, enum: Object.values(AccountOwnerType), required: true, index: true },
    
    ownerId: { type: Schema.Types.ObjectId, index: true }, // Not using ref strictly since it can be User or Salon
    
    currency: { type: String, required: true, default: 'INR' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent a specific owner from having multiple accounts of the same code logic 
// usually handled in service, but we index ownerId + code just in case
ledgerAccountSchema.index({ ownerId: 1, code: 1 }, { unique: true, partialFilterExpression: { ownerId: { $exists: true } } });

export const LedgerAccount = mongoose.model<ILedgerAccount>('LedgerAccount', ledgerAccountSchema);
