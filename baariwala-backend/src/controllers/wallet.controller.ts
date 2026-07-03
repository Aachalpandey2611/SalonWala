import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';
import { Wallet } from '../models/Wallet';
import { WalletTransactionReference } from '../models/WalletTransactionReference';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const getWalletController = catchAsync(async (req: Request, res: Response) => {
  const wallet = await WalletService.getOrCreateWallet(req.user!.id);
  // Force sync from ledger
  await WalletService.syncBalanceFromLedger(req.user!.id);
  
  res.status(200).json({ success: true, data: wallet });
});

export const getWalletTransactionsController = catchAsync(async (req: Request, res: Response) => {
  const wallet = await Wallet.findOne({ customerId: req.user!.id });
  if (!wallet) throw new AppError('Wallet not found', 404);
  
  const limit = parseInt(req.query.limit as string) || 20;
  
  const transactions = await WalletTransactionReference.find({ walletId: wallet._id })
    .populate('journalId', 'description transactionType status createdAt')
    .sort({ createdAt: -1 })
    .limit(limit);
    
  res.status(200).json({ success: true, data: transactions });
});

export const rechargeWalletController = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const result = await WalletService.initiateRecharge(req.user!.id, amount);
  res.status(200).json({ success: true, data: result });
});

export const payUsingWalletController = catchAsync(async (req: Request, res: Response) => {
  const { salonId, amount, referenceId } = req.body;
  const result = await WalletService.payFromWallet(req.user!.id, salonId, amount, referenceId);
  res.status(200).json({ success: true, data: result });
});
