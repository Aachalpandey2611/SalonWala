import mongoose from 'mongoose';
import { Wallet, WalletStatus } from '../models/Wallet';
import { WalletLimit } from '../models/WalletLimit';
import { WalletTransactionReference, WalletOperationType } from '../models/WalletTransactionReference';
import { LedgerService } from './ledger.service';
import { LedgerAccount, AccountType, AccountOwnerType } from '../models/LedgerAccount';
import { TransactionType } from '../models/LedgerJournal';
import { EntryDirection } from '../models/LedgerEntry';
import { AppError } from '../utils/AppError';
import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class WalletService {
  /**
   * Initializes or fetches a wallet for a customer
   */
  static async getOrCreateWallet(customerId: string) {
    let wallet = await Wallet.findOne({ customerId });
    if (!wallet) {
      wallet = await Wallet.create({ customerId });
    }
    return wallet;
  }

  /**
   * Core function: Syncs wallet cache directly from the Ledger.
   * FINTECH RULE: Wallet Balance MUST always be derived from Ledger.
   */
  static async syncBalanceFromLedger(customerId: string) {
    const wallet = await this.getOrCreateWallet(customerId);
    
    // Find customer's ledger account
    const account = await LedgerAccount.findOne({ ownerId: customerId, ownerType: AccountOwnerType.CUSTOMER });
    if (!account) {
      return wallet.currentBalance; // Wallet hasn't had transactions yet
    }
    
    const balanceInfo = await LedgerService.getBalance(account._id.toString());
    
    if (wallet.currentBalance !== balanceInfo.balance) {
      wallet.currentBalance = balanceInfo.balance;
      wallet.lastActivity = new Date();
      await wallet.save();
      
      EventBusService.publish('WalletBalanceUpdated', {
        customerId,
        newBalance: wallet.currentBalance
      }, 'WalletEngine');
    }
    
    return wallet.currentBalance;
  }

  /**
   * Recharge Wallet - Initiates a PaymentOrder to the PaymentGateway
   * The actual balance update happens ONLY when PaymentCaptured is fired.
   */
  static async initiateRecharge(customerId: string, amount: number) {
    const wallet = await this.getOrCreateWallet(customerId);
    if (wallet.status !== WalletStatus.ACTIVE) throw new AppError(`Wallet is ${wallet.status}`, 400);
    
    // Check limits (Assuming STANDARD level for now)
    const limit = await WalletLimit.findOne({ customerLevel: 'STANDARD' }) || await WalletLimit.create({ customerLevel: 'STANDARD' });
    if (wallet.currentBalance + amount > limit.maxWalletBalance) {
      throw new AppError(`Recharge exceeds maximum wallet limit of ${limit.maxWalletBalance}`, 400);
    }
    
    // Create a payment order via the Provider-Agnostic PaymentGateway
    // Note: Since PaymentService is strictly tied to Booking, we'll mock the wallet 
    // recharge initiation for the FinTech grade requirement here.
    const mockOrderId = `order_${crypto.randomUUID()}`;
    
    return {
      walletId: wallet._id,
      orderId: mockOrderId,
      amount,
      currency: 'INR'
    };
  }

  /**
   * Pay using Wallet - Posts a Journal entry debiting the wallet and crediting the Salon.
   */
  static async payFromWallet(customerId: string, salonId: string, amount: number, referenceId: string) {
    const wallet = await this.getOrCreateWallet(customerId);
    if (wallet.status !== WalletStatus.ACTIVE) throw new AppError(`Wallet is ${wallet.status}`, 400);
    
    // Sync to ensure we have real balance
    const currentBalance = await this.syncBalanceFromLedger(customerId);
    if (currentBalance < amount) throw new AppError('Insufficient wallet balance', 400);
    
    const limit = await WalletLimit.findOne({ customerLevel: 'STANDARD' }) || await WalletLimit.create({ customerLevel: 'STANDARD' });
    if (amount > limit.maxSingleTransaction) throw new AppError(`Transaction exceeds single transaction limit of ${limit.maxSingleTransaction}`, 400);
    
    // Fetch Ledger Accounts
    const customerAccount = await LedgerAccount.findOne({ ownerId: customerId, ownerType: AccountOwnerType.CUSTOMER });
    if (!customerAccount) throw new AppError('Customer ledger account not found', 404);
    
    const salonAccount = await LedgerAccount.findOne({ ownerId: salonId, ownerType: AccountOwnerType.SALON });
    if (!salonAccount) throw new AppError('Salon ledger account not found', 404);
    
    // Post to Ledger
    const journal = await LedgerService.postTransaction({
      transactionId: `WAL-PAY-${Date.now()}`,
      transactionType: TransactionType.WALLET_DEBIT,
      description: `Wallet Payment for Booking ${referenceId}`,
      referenceId,
      customerId,
      salonId,
      initiatedBy: customerId,
      initiatedBySystem: false,
      entries: [
        {
          accountId: customerAccount._id,
          direction: EntryDirection.DEBIT, // Debiting a liability/equity decreases balance
          amount,
          description: `Wallet Debit for Payment`
        },
        {
          accountId: salonAccount._id,
          direction: EntryDirection.CREDIT,
          amount,
          description: `Salon Revenue Credit`
        }
      ]
    });
    
    // Store Wallet Reference
    await WalletTransactionReference.create({
      walletId: wallet._id,
      journalId: journal._id,
      operationType: WalletOperationType.PAYMENT,
      amount,
      direction: 'DEBIT'
    });
    
    // Re-sync balance
    await this.syncBalanceFromLedger(customerId);
    
    EventBusService.publish('WalletDebited', { customerId, amount, newBalance: wallet.currentBalance }, 'WalletEngine');
    
    return journal;
  }
}
