import mongoose, { Document, Schema } from 'mongoose';

export enum JournalStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
  FAILED = 'FAILED'
}

export enum TransactionType {
  BOOKING_PAYMENT = 'BOOKING_PAYMENT',
  WALLET_CREDIT = 'WALLET_CREDIT',
  WALLET_DEBIT = 'WALLET_DEBIT',
  REFUND = 'REFUND',
  CASHBACK = 'CASHBACK',
  COMMISSION = 'COMMISSION',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  REVERSAL = 'REVERSAL'
}

export interface ILedgerJournal extends Document {
  transactionId: string; // Unique external reference (e.g. TXN-123456)
  transactionType: TransactionType;
  
  description: string;
  
  // References to external entities (Optional, based on transaction type)
  referenceId?: mongoose.Types.ObjectId; // E.g., Payment ID, Refund ID
  bookingId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  salonId?: mongoose.Types.ObjectId;
  
  currency: string;
  totalAmount: number; // For easy querying, the absolute value of the transaction
  
  status: JournalStatus;
  
  reversalReference?: mongoose.Types.ObjectId; // If this journal reverses another, point to it
  
  postedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const ledgerJournalSchema = new Schema<ILedgerJournal>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    transactionType: { type: String, enum: Object.values(TransactionType), required: true, index: true },
    
    description: { type: String, required: true },
    
    referenceId: { type: Schema.Types.ObjectId, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Appointment', index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', index: true },
    
    currency: { type: String, required: true, default: 'INR' },
    totalAmount: { type: Number, required: true, min: 0 },
    
    status: { type: String, enum: Object.values(JournalStatus), default: JournalStatus.PENDING, index: true },
    
    reversalReference: { type: Schema.Types.ObjectId, ref: 'LedgerJournal' },
    
    postedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const LedgerJournal = mongoose.model<ILedgerJournal>('LedgerJournal', ledgerJournalSchema);
