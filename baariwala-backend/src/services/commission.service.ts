import mongoose from 'mongoose';
import { Commission, CommissionSourceEvent, CommissionStatus, ICommission } from '../models/Commission';
import { CommissionConfiguration, CommissionProcessingMode } from '../models/CommissionConfiguration';
import { CommissionRule, CommissionRuleType, CommissionTargetType, ICommissionRule } from '../models/CommissionRule';
import { CommissionHistory } from '../models/CommissionHistory';
import { CommissionAdjustment, AdjustmentType } from '../models/CommissionAdjustment';
import { Appointment } from '../models/Appointment';
import { AppError } from '../utils/AppError';
import { EventBusService } from './eventBus.service';
import { CommissionRuleCache } from '../utils/CommissionRuleCache';
import { logger } from '../utils/logger';

export class CommissionService {
  /**
   * Processes commission for a completed appointment.
   */
  static async processAppointmentCommission(appointmentId: string) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    
    const config = await CommissionConfiguration.findOne({ salonId: appointment.salonId });
    if (!config || !config.isEnabled) {
      logger.info(`[CommissionEngine] Commissions disabled for Salon ${appointment.salonId}`);
      return;
    }
    
    // Check if commission already generated
    const existing = await Commission.findOne({ referenceId: appointment._id, sourceEvent: CommissionSourceEvent.APPOINTMENT_COMPLETED });
    if (existing) return existing;
    
    const baseAmount = appointment.bookedPrice || 0;
    
    // Fetch rules from Redis Cache
    const rules = await CommissionRuleCache.getActiveRulesForSalon(appointment.salonId.toString());
    
    // Rule Resolution Engine (Highest Priority Wins, ties broken by newest)
    // Priority order for fallback: SERVICE > ROLE > CAMPAIGN > BRANCH > DEFAULT
    // Since rules are pre-sorted by `priority DESC` and `createdAt DESC` in the Cache utility, 
    // we just find the first match.
    
    let matchedRule: ICommissionRule | undefined;
    
    // 1. Try Service Rule
    matchedRule = rules.find(r => r.targetType === CommissionTargetType.SERVICE && r.targetId === appointment.primaryServiceId.toString());
    
    // 2. Try Branch Rule
    if (!matchedRule) {
      matchedRule = rules.find(r => r.targetType === CommissionTargetType.BRANCH && r.targetId === appointment.branchId.toString());
    }
    
    // 3. Fallback to Default
    if (!matchedRule) {
      matchedRule = rules.find(r => r.targetType === CommissionTargetType.DEFAULT);
    }
    
    let calculatedAmount = 0;
    let appliedRuleId: mongoose.Types.ObjectId | undefined;
    
    if (matchedRule) {
      appliedRuleId = matchedRule._id as mongoose.Types.ObjectId;
      calculatedAmount = this.calculateAmount(matchedRule, baseAmount);
    } else {
      // Fallback to global config
      calculatedAmount = (baseAmount * config.defaultCommissionPercentage) / 100;
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const commission = await Commission.create([{
        salonId: appointment.salonId,
        branchId: appointment.branchId,
        recipientId: appointment.barberId,
        sourceEvent: CommissionSourceEvent.APPOINTMENT_COMPLETED,
        referenceId: appointment._id,
        baseAmount,
        ruleAppliedId: appliedRuleId,
        calculatedAmount,
        status: CommissionStatus.CALCULATED
      }], { session });
      
      await CommissionHistory.create([{
        commissionId: commission[0]._id,
        newStatus: CommissionStatus.CALCULATED,
        notes: 'Initial calculation',
        initiatedBySystem: true
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      // Publish event
      EventBusService.publish('CommissionCreated', {
        commissionId: commission[0]._id,
        recipientId: commission[0].recipientId,
        amount: commission[0].calculatedAmount
      }, 'CommissionEngine');
      
      return commission[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`[CommissionEngine] Failed to process commission for Booking ${appointmentId}`, error);
      throw new AppError('Failed to process commission', 500);
    }
  }

  private static calculateAmount(rule: ICommissionRule, baseAmount: number): number {
    let amt = 0;
    if (rule.ruleType === CommissionRuleType.FLAT) {
      amt = rule.rate || 0;
    } else if (rule.ruleType === CommissionRuleType.PERCENTAGE) {
      amt = (baseAmount * (rule.rate || 0)) / 100;
    } else if (rule.ruleType === CommissionRuleType.HYBRID) {
      amt = (baseAmount * (rule.rate || 0)) / 100;
      if (rule.minAmount && amt < rule.minAmount) amt = rule.minAmount;
      if (rule.maxAmount && amt > rule.maxAmount) amt = rule.maxAmount;
    } else if (rule.ruleType === CommissionRuleType.TIER_BASED && rule.tiers) {
      // Find matching tier
      const matchingTier = rule.tiers.find(t => 
        baseAmount >= t.minThreshold && 
        (!t.maxThreshold || baseAmount <= t.maxThreshold)
      );
      if (matchingTier) {
        amt = (baseAmount * matchingTier.rate) / 100;
      }
    }
    return amt;
  }

  /**
   * Handle Refund (Partial or Full)
   */
  static async reverseCommission(referenceId: string, refundedAmount: number, totalOriginalAmount: number) {
    const commissions = await Commission.find({ referenceId, status: { $nin: [CommissionStatus.CANCELLED, CommissionStatus.REVERSED] } });
    
    for (const commission of commissions) {
      if (commission.isLocked) {
        logger.warn(`[CommissionEngine] Attempted to reverse locked commission ${commission._id}. Skipping.`);
        continue;
      }
      
      // Calculate proportionality
      const refundRatio = refundedAmount / totalOriginalAmount;
      const reversedAmount = commission.calculatedAmount * refundRatio;
      
      const session = await mongoose.startSession();
      session.startTransaction();
      
      try {
        commission.reversedAmount += reversedAmount;
        const previousStatus = commission.status;
        
        // If fully refunded
        if (commission.reversedAmount >= commission.calculatedAmount) {
          commission.status = CommissionStatus.REVERSED;
          commission.reversedAmount = commission.calculatedAmount;
        }
        
        await commission.save({ session });
        
        await CommissionHistory.create([{
          commissionId: commission._id,
          previousStatus,
          newStatus: commission.status,
          notes: `Reversed ${reversedAmount} due to refund`,
          initiatedBySystem: true
        }], { session });
        
        await session.commitTransaction();
        session.endSession();
        
        EventBusService.publish('CommissionReversed', {
          commissionId: commission._id,
          recipientId: commission.recipientId,
          reversedAmount
        }, 'CommissionEngine');
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        logger.error(`[CommissionEngine] Failed to reverse commission ${commission._id}`, error);
      }
    }
  }

  /**
   * Manual Adjustment
   */
  static async adjustCommission(commissionId: string, type: AdjustmentType, amount: number, reason: string, adminId: string) {
    const commission = await Commission.findById(commissionId);
    if (!commission) throw new AppError('Commission not found', 404);
    if (commission.isLocked) throw new AppError('Cannot adjust a locked commission', 400);
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      await CommissionAdjustment.create([{
        commissionId: commission._id,
        adjustmentType: type,
        amount,
        reason,
        adjustedBy: new mongoose.Types.ObjectId(adminId)
      }], { session });
      
      // Apply adjustment directly to calculatedAmount for simplicity in Part 2 MVP,
      // Or we can leave calculatedAmount immutable and compute Total = Calculated + Adjustments on the fly.
      // Modifying calculatedAmount since it's the simplest approach for "Single source of truth" endpoints right now.
      
      if (type === AdjustmentType.BONUS) {
        commission.calculatedAmount += amount;
      } else {
        commission.calculatedAmount -= amount;
        if (commission.calculatedAmount < 0) commission.calculatedAmount = 0; // Prevent negative
      }
      
      await commission.save({ session });
      
      await CommissionHistory.create([{
        commissionId: commission._id,
        previousStatus: commission.status,
        newStatus: commission.status,
        notes: `Manual Adjustment: ${type} of ${amount}. Reason: ${reason}`,
        initiatedBySystem: false
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      return commission;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError('Failed to adjust commission', 500);
    }
  }

  /**
   * Status Approval Workflow
   */
  static async changeStatus(commissionId: string, newStatus: CommissionStatus, adminId: string) {
    const commission = await Commission.findById(commissionId);
    if (!commission) throw new AppError('Commission not found', 404);
    
    if (commission.isLocked && newStatus !== CommissionStatus.PAID && newStatus !== CommissionStatus.TRANSFERRED) {
      throw new AppError('Cannot change status of locked commission unless paying/transferring', 400);
    }
    
    const previousStatus = commission.status;
    commission.status = newStatus;
    
    if (newStatus === CommissionStatus.APPROVED || newStatus === CommissionStatus.LOCKED) {
      commission.isLocked = true;
    }
    
    await commission.save();
    
    await CommissionHistory.create({
      commissionId: commission._id,
      previousStatus,
      newStatus,
      notes: `Status changed to ${newStatus}`,
      initiatedBySystem: false
    });
    
    return commission;
  }
}
