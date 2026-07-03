import { EventBusService } from './eventBus.service';
import { WalletService } from './wallet.service';
import { LedgerService } from './ledger.service';
import { LedgerAccount, AccountType, AccountOwnerType } from '../models/LedgerAccount';
import { TransactionType } from '../models/LedgerJournal';
import { EntryDirection } from '../models/LedgerEntry';
import { WalletTransactionReference, WalletOperationType } from '../models/WalletTransactionReference';
import { logger } from '../utils/logger';

export function initializeWalletEventListeners() {
  
  // Listen for generic ledger updates to sync cache
  // EventBusService.subscribe('LedgerEntryCreated', 'WalletEngine', async (payload: any) => { ... });
  
  // Listen for Payment Captured specifically for Wallet Recharge
  EventBusService.subscribe('PaymentCaptured', 'WalletEngine', async (payload: any) => {
    try {
      const { paymentId, customerId, amount, isWalletRecharge } = payload;
      
      // Only process if this payment was a wallet recharge
      // Since our PaymentGateway doesn't strictly differentiate yet, let's assume 
      // we check a flag or order context. For demonstration, we check `isWalletRecharge`.
      if (!isWalletRecharge) return;
      
      logger.info(`[WalletEventListener] Processing Wallet Recharge for Customer ${customerId}`);
      
      const systemCashAccount = await LedgerService.getOrCreateSystemAccount('SYS_CASH_01', 'System Cash Account', AccountType.ASSET);
      
      // Ensure customer ledger account exists
      let customerAccount = await LedgerAccount.findOne({ ownerId: customerId, ownerType: AccountOwnerType.CUSTOMER });
      if (!customerAccount) {
        customerAccount = await LedgerAccount.create({
          code: `CUST-${customerId.substring(0, 8)}`,
          name: `Customer Wallet ${customerId}`,
          accountType: AccountType.LIABILITY, // Wallet balances are liabilities for SalonWala
          ownerId: customerId,
          ownerType: AccountOwnerType.CUSTOMER
        });
      }
      
      // Post to Ledger
      const journal = await LedgerService.postTransaction({
        transactionId: `WAL-REC-${paymentId}`,
        transactionType: TransactionType.WALLET_CREDIT,
        description: `Wallet Recharge via Payment Gateway`,
        referenceId: paymentId,
        customerId,
        initiatedBySystem: true,
        entries: [
          {
            accountId: systemCashAccount._id,
            direction: EntryDirection.DEBIT, // Cash increases
            amount: amount,
            description: `Recharge Payment Received`
          },
          {
            accountId: customerAccount._id,
            direction: EntryDirection.CREDIT, // Liability increases (Wallet balance goes up)
            amount: amount,
            description: `Wallet Balance Credited`
          }
        ]
      });
      
      const wallet = await WalletService.getOrCreateWallet(customerId);
      await WalletTransactionReference.create({
        walletId: wallet._id,
        journalId: journal._id,
        operationType: WalletOperationType.RECHARGE,
        amount,
        direction: 'CREDIT'
      });
      
      // Sync cache
      await WalletService.syncBalanceFromLedger(customerId);
      
      logger.info(`[WalletEventListener] Successfully credited wallet for customer ${customerId}`);
    } catch (error) {
      logger.error(`[WalletEventListener] Failed to process wallet recharge`, error);
    }
  });
}
