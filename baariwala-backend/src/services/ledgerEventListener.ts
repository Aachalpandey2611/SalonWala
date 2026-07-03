import { EventBusService } from './eventBus.service';
import { LedgerService } from './ledger.service';
import { AccountType, AccountOwnerType } from '../models/LedgerAccount';
import { TransactionType } from '../models/LedgerJournal';
import { EntryDirection } from '../models/LedgerEntry';
import { logger } from '../utils/logger';
import mongoose from 'mongoose';

export function initializeLedgerEventListeners() {
  EventBusService.subscribe('PaymentCaptured', 'LedgerEngine', async (payload: any) => {
    try {
      logger.info(`[LedgerEventListener] Processing PaymentCaptured for booking ${payload.bookingId}`);
      
      const { paymentId, bookingId, amount } = payload;
      
      // We need to fetch the booking to know the salon ID and customer ID.
      // However, we can simply rely on LedgerService to pull what we pass, or fetch it here.
      // We will create/fetch system accounts
      const systemCashAccount = await LedgerService.getOrCreateSystemAccount('SYS_CASH_01', 'System Cash Account', AccountType.ASSET);
      const salonPayableAccount = await LedgerService.getOrCreateSystemAccount('SYS_PAYABLE_01', 'Pending Salon Payables', AccountType.LIABILITY);
      
      // We could also dynamically create a LedgerAccount for the specific Salon, but for now
      // we'll post to the system liability account and tag the journal with salonId.
      
      await LedgerService.postTransaction({
        transactionId: `PAY-${paymentId}`,
        transactionType: TransactionType.BOOKING_PAYMENT,
        description: `Payment captured for booking ${bookingId}`,
        referenceId: paymentId,
        bookingId,
        // we'll assume INR if not passed
        currency: 'INR',
        initiatedBySystem: true,
        entries: [
          {
            accountId: systemCashAccount._id,
            direction: EntryDirection.DEBIT,
            amount: amount,
            description: `Payment received in System Bank`
          },
          {
            accountId: salonPayableAccount._id,
            direction: EntryDirection.CREDIT,
            amount: amount,
            description: `Liability payable to Salon`
          }
        ]
      });
      
      logger.info(`[LedgerEventListener] Successfully posted PaymentCaptured journal for booking ${bookingId}`);
    } catch (error) {
      logger.error(`[LedgerEventListener] Failed to process PaymentCaptured`, error);
    }
  });
}
