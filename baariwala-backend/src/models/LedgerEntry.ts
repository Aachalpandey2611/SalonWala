import mongoose, { Document, Schema } from 'mongoose';

export enum EntryDirection {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT'
}

export interface ILedgerEntry extends Document {
  journalId: mongoose.Types.ObjectId; // References LedgerJournal
  accountId: mongoose.Types.ObjectId; // References LedgerAccount
  
  direction: EntryDirection;
  
  amount: number; // Strictly positive number
  currency: string;
  
  description?: string;
  
  createdAt: Date;
}

const ledgerEntrySchema = new Schema<ILedgerEntry>(
  {
    journalId: { type: Schema.Types.ObjectId, ref: 'LedgerJournal', required: true, index: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'LedgerAccount', required: true, index: true },
    
    direction: { type: String, enum: Object.values(EntryDirection), required: true, index: true },
    
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'INR' },
    
    description: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const LedgerEntry = mongoose.model<ILedgerEntry>('LedgerEntry', ledgerEntrySchema);
