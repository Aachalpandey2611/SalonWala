import { z } from 'zod';
import { EntryDirection } from '../models/LedgerEntry';
import { TransactionType } from '../models/LedgerJournal';

export const ledgerSchemas = {
  postManualTransaction: z.object({
    body: z.object({
      transactionId: z.string().min(1, 'Transaction ID is required'),
      transactionType: z.enum([TransactionType.MANUAL_ADJUSTMENT]), // Only manual adjustments via API
      description: z.string().min(1, 'Description is required'),
      currency: z.string().optional(),
      entries: z.array(z.object({
        accountId: z.string().min(1, 'Account ID is required'),
        direction: z.nativeEnum(EntryDirection),
        amount: z.number().positive(),
        description: z.string().optional()
      })).min(2, 'At least 2 entries required for double-entry')
    })
  }),
  
  reverseTransaction: z.object({
    body: z.object({
      reason: z.string().min(5, 'A valid reason is required for reversal')
    }),
    params: z.object({
      id: z.string().min(1, 'Journal ID is required')
    })
  })
};
