import mongoose from 'mongoose';
import { Settlement, SettlementStatus } from '../models/Settlement';
import { SettlementBatch, BatchStatus } from '../models/SettlementBatch';
import { Invoice, InvoiceStatus } from '../models/Invoice';
import { Salon } from '../models/Salon';
import { AppError } from '../utils/AppError';
import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export class SettlementService {
  /**
   * Generates a batch settlement for a specific time period.
   * Scans all PAID invoices and aggregates totals per Salon.
   */
  static async generateSettlementBatch(periodStart: Date, periodEnd: Date, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const batchId = `SETTLE-BATCH-${Date.now()}`;
      
      const batch = await SettlementBatch.create([{
        batchId,
        status: BatchStatus.GENERATED,
        processedBy: new mongoose.Types.ObjectId(adminId)
      }], { session });
      
      // Find all paid invoices in period
      const invoices = await Invoice.find({
        status: InvoiceStatus.PAID,
        updatedAt: { $gte: periodStart, $lte: periodEnd }
      });
      
      // Group by Salon
      const salonTotals: Record<string, number> = {};
      
      invoices.forEach(inv => {
        const salonId = inv.salonId.toString();
        if (!salonTotals[salonId]) salonTotals[salonId] = 0;
        salonTotals[salonId] += inv.grandTotal;
      });
      
      let totalSettlements = 0;
      let totalGrossAmount = 0;
      let totalNetAmount = 0;
      
      // Create individual settlements
      for (const [salonId, grossAmount] of Object.entries(salonTotals)) {
        // Platform Config: 10% Platform Fee, 2% Gateway Fee, 18% GST on Fees
        const platformFee = grossAmount * 0.10;
        const gatewayFee = grossAmount * 0.02;
        const totalFees = platformFee + gatewayFee;
        const taxOnFees = totalFees * 0.18;
        
        const netAmount = grossAmount - totalFees - taxOnFees;
        
        await Settlement.create([{
          salonId: new mongoose.Types.ObjectId(salonId),
          settlementBatchId: batch[0]._id,
          periodStart,
          periodEnd,
          grossAmount,
          platformFeeAmount: platformFee,
          gatewayFeeAmount: gatewayFee,
          taxAmount: taxOnFees,
          netSettlementAmount: netAmount,
          status: SettlementStatus.PENDING
        }], { session });
        
        totalSettlements++;
        totalGrossAmount += grossAmount;
        totalNetAmount += netAmount;
      }
      
      batch[0].totalSettlements = totalSettlements;
      batch[0].totalGrossAmount = totalGrossAmount;
      batch[0].totalNetAmount = totalNetAmount;
      await batch[0].save({ session });
      
      await session.commitTransaction();
      session.endSession();
      
      logger.info(`[SettlementService] Batch ${batchId} generated successfully.`);
      return batch[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`[SettlementService] Failed to generate settlement batch`, error);
      throw new AppError('Failed to generate settlements', 500);
    }
  }
}
