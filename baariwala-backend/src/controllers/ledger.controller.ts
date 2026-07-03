import { Request, Response } from 'express';
import { LedgerService } from '../services/ledger.service';
import { LedgerJournal } from '../models/LedgerJournal';
import { LedgerAccount, AccountOwnerType } from '../models/LedgerAccount';
import { LedgerEntry } from '../models/LedgerEntry';
import { LedgerAudit } from '../models/LedgerAudit';
import { catchAsync } from '../utils/catchAsync';

export const postManualAdjustmentController = catchAsync(async (req: Request, res: Response) => {
  // Assuming req.user is superadmin
  const journal = await LedgerService.postTransaction({
    ...req.body,
    initiatedBy: req.user!.id,
    initiatedBySystem: false
  });
  res.status(201).json({ success: true, data: journal });
});

export const reverseJournalController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { reason } = req.body;
  
  const reversal = await LedgerService.reverseTransaction(id, reason, req.user!.id);
  res.status(200).json({ success: true, data: reversal });
});

export const getAccountBalanceController = catchAsync(async (req: Request, res: Response) => {
  const accountId = req.params.accountId as string;
  const balance = await LedgerService.getBalance(accountId);
  res.status(200).json({ success: true, data: balance });
});

export const getCustomerLedgerController = catchAsync(async (req: Request, res: Response) => {
  const account = await LedgerAccount.findOne({ ownerId: req.user!.id, ownerType: AccountOwnerType.CUSTOMER });
  if (!account) return res.status(404).json({ success: false, message: 'No ledger account found for this customer' });
  
  const balance = await LedgerService.getBalance(account._id.toString());
  
  const entries = await LedgerEntry.find({ accountId: account._id })
    .populate('journalId', 'transactionType description status createdAt')
    .sort({ createdAt: -1 })
    .limit(50);
    
  res.status(200).json({ success: true, data: { balance, history: entries } });
});

export const getSalonLedgerController = catchAsync(async (req: Request, res: Response) => {
  const { salonId } = req.params;
  const account = await LedgerAccount.findOne({ ownerId: salonId, ownerType: AccountOwnerType.SALON });
  if (!account) return res.status(404).json({ success: false, message: 'No ledger account found for this salon' });
  
  const balance = await LedgerService.getBalance(account._id.toString());
  
  const entries = await LedgerEntry.find({ accountId: account._id })
    .populate('journalId', 'transactionType description status createdAt')
    .sort({ createdAt: -1 })
    .limit(100);
    
  res.status(200).json({ success: true, data: { balance, history: entries } });
});

export const getLedgerHistoryController = catchAsync(async (req: Request, res: Response) => {
  const accountId = req.params.accountId as string;
  const entries = await LedgerEntry.find({ accountId })
    .populate('journalId')
    .sort({ createdAt: -1 })
    .limit(100);
  res.status(200).json({ success: true, data: entries });
});
