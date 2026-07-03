import mongoose, { ClientSession } from 'mongoose';
import { LedgerAccount, AccountType, AccountOwnerType } from '../models/LedgerAccount';
import { LedgerJournal, JournalStatus, TransactionType } from '../models/LedgerJournal';
import { LedgerEntry, EntryDirection } from '../models/LedgerEntry';
import { LedgerAudit, AuditAction } from '../models/LedgerAudit';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export interface EntryPayload {
  accountId: mongoose.Types.ObjectId;
  direction: EntryDirection;
  amount: number;
  description?: string;
}

export interface JournalPayload {
  transactionId: string;
  transactionType: TransactionType;
  description: string;
  referenceId?: string | mongoose.Types.ObjectId;
  bookingId?: string | mongoose.Types.ObjectId;
  customerId?: string | mongoose.Types.ObjectId;
  salonId?: string | mongoose.Types.ObjectId;
  currency?: string;
  entries: EntryPayload[];
  initiatedBy?: string | mongoose.Types.ObjectId;
  initiatedBySystem?: boolean;
}

export class LedgerService {
  /**
   * System Setup: Creates necessary system accounts if they don't exist
   */
  static async getOrCreateSystemAccount(code: string, name: string, type: AccountType) {
    let account = await LedgerAccount.findOne({ code, ownerType: AccountOwnerType.SYSTEM });
    if (!account) {
      account = await LedgerAccount.create({
        code,
        name,
        accountType: type,
        ownerType: AccountOwnerType.SYSTEM,
      });
    }
    return account;
  }

  /**
   * Core double-entry posting logic. Enforces Dr = Cr.
   */
  static async postTransaction(payload: JournalPayload) {
    if (!payload.entries || payload.entries.length < 2) {
      throw new AppError('Ledger must contain at least two entries (one debit, one credit)', 400);
    }

    let totalDebits = 0;
    let totalCredits = 0;
    
    for (const entry of payload.entries) {
      if (entry.amount <= 0) throw new AppError('Entry amount must be positive', 400);
      if (entry.direction === EntryDirection.DEBIT) totalDebits += entry.amount;
      if (entry.direction === EntryDirection.CREDIT) totalCredits += entry.amount;
    }

    // Floating point safe equality check
    if (Math.abs(totalDebits - totalCredits) > 0.0001) {
      throw new AppError(`Unbalanced Journal: Debits (${totalDebits}) do not equal Credits (${totalCredits})`, 400);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Create Journal
      const journal = await LedgerJournal.create([{
        transactionId: payload.transactionId,
        transactionType: payload.transactionType,
        description: payload.description,
        referenceId: payload.referenceId,
        bookingId: payload.bookingId,
        customerId: payload.customerId,
        salonId: payload.salonId,
        currency: payload.currency || 'INR',
        totalAmount: totalDebits,
        status: JournalStatus.POSTED,
        postedAt: new Date()
      }], { session });

      const journalId = journal[0]._id;

      // 2. Create Entries
      const dbEntries = payload.entries.map(e => ({
        journalId,
        accountId: e.accountId,
        direction: e.direction,
        amount: e.amount,
        currency: payload.currency || 'INR',
        description: e.description
      }));
      
      await LedgerEntry.insertMany(dbEntries, { session });

      // 3. Create Audit
      await LedgerAudit.create([{
        journalId,
        action: AuditAction.CREATE,
        initiatedBy: payload.initiatedBy,
        initiatedBySystem: payload.initiatedBySystem ?? true,
        reason: 'Initial transaction posting'
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return journal[0];
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      
      // Attempt to log failure asynchronously outside transaction
      LedgerAudit.create({
        action: AuditAction.FAIL,
        reason: error.message,
        initiatedBy: payload.initiatedBy,
        initiatedBySystem: payload.initiatedBySystem ?? true,
        metadata: { transactionId: payload.transactionId }
      }).catch(err => logger.error('[LedgerService] Failed to create audit log for failed txn', err));

      if (error.code === 11000) {
        throw new AppError('Duplicate transaction ID', 409);
      }
      throw error;
    }
  }

  /**
   * Reverses a posted transaction safely.
   */
  static async reverseTransaction(journalId: string, reason: string, adminId: string) {
    const originalJournal = await LedgerJournal.findById(journalId);
    if (!originalJournal) throw new AppError('Journal not found', 404);
    if (originalJournal.status !== JournalStatus.POSTED) throw new AppError('Only POSTED journals can be reversed', 400);

    // Prevent double reversal
    const existingReversal = await LedgerJournal.findOne({ reversalReference: originalJournal._id });
    if (existingReversal) throw new AppError('Journal is already reversed', 400);

    const originalEntries = await LedgerEntry.find({ journalId: originalJournal._id });

    // Reverse directions
    const reversalEntries: EntryPayload[] = originalEntries.map(e => ({
      accountId: e.accountId,
      direction: e.direction === EntryDirection.DEBIT ? EntryDirection.CREDIT : EntryDirection.DEBIT,
      amount: e.amount,
      description: `Reversal of: ${e.description || originalJournal.description}`
    }));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const reversalJournal = await LedgerJournal.create([{
        transactionId: `REV-${originalJournal.transactionId}-${Date.now()}`,
        transactionType: TransactionType.REVERSAL,
        description: `Reversal: ${reason}`,
        referenceId: originalJournal.referenceId,
        bookingId: originalJournal.bookingId,
        customerId: originalJournal.customerId,
        salonId: originalJournal.salonId,
        currency: originalJournal.currency,
        totalAmount: originalJournal.totalAmount,
        status: JournalStatus.POSTED,
        reversalReference: originalJournal._id,
        postedAt: new Date()
      }], { session });

      const revJournalId = reversalJournal[0]._id;

      const dbEntries = reversalEntries.map(e => ({
        journalId: revJournalId,
        accountId: e.accountId,
        direction: e.direction,
        amount: e.amount,
        currency: originalJournal.currency,
        description: e.description
      }));

      await LedgerEntry.insertMany(dbEntries, { session });

      // Update original status
      await LedgerJournal.findByIdAndUpdate(originalJournal._id, { status: JournalStatus.REVERSED }, { session });

      await LedgerAudit.create([{
        journalId: revJournalId,
        action: AuditAction.REVERSE,
        initiatedBy: adminId,
        initiatedBySystem: false,
        reason
      }], { session });

      await session.commitTransaction();
      session.endSession();

      return reversalJournal[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Dynamically aggregates the current balance for an account.
   */
  static async getBalance(accountId: string) {
    const account = await LedgerAccount.findById(accountId);
    if (!account) throw new AppError('Account not found', 404);

    const entries = await LedgerEntry.aggregate([
      { $match: { accountId: new mongoose.Types.ObjectId(accountId) } },
      { $lookup: {
          from: 'ledgerjournals',
          localField: 'journalId',
          foreignField: '_id',
          as: 'journal'
        }
      },
      { $unwind: '$journal' },
      { $match: { 'journal.status': JournalStatus.POSTED } },
      { $group: {
          _id: '$direction',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let debits = 0;
    let credits = 0;

    entries.forEach(e => {
      if (e._id === EntryDirection.DEBIT) debits = e.total;
      if (e._id === EntryDirection.CREDIT) credits = e.total;
    });

    let balance = 0;
    // Standard accounting rules
    switch (account.accountType) {
      case AccountType.ASSET:
      case AccountType.EXPENSE:
        balance = debits - credits; // Normal balance is Debit
        break;
      case AccountType.LIABILITY:
      case AccountType.REVENUE:
      case AccountType.EQUITY:
        balance = credits - debits; // Normal balance is Credit
        break;
    }

    return {
      accountId: account._id,
      code: account.code,
      name: account.name,
      currency: account.currency,
      accountType: account.accountType,
      balance,
      totalDebits: debits,
      totalCredits: credits
    };
  }
}
