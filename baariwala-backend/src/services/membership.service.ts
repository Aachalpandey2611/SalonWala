import mongoose from 'mongoose';
import { MembershipPlan, BillingCycle } from '../models/MembershipPlan';
import { UserMembership, MembershipStatus } from '../models/UserMembership';
import { MembershipHistory, MembershipAction } from '../models/MembershipHistory';
import { AppError } from '../utils/AppError';
import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export class MembershipService {
  /**
   * Initiate a membership purchase
   * Real world: Generates a payment link and returns to customer.
   */
  static async purchaseMembership(customerId: string, planId: string) {
    const plan = await MembershipPlan.findById(planId);
    if (!plan || !plan.isActive) throw new AppError('Membership plan not found or inactive', 404);
    
    // Check if user already has an active membership
    const existing = await UserMembership.findOne({ customerId, status: MembershipStatus.ACTIVE });
    if (existing) throw new AppError('Customer already has an active membership. Please upgrade or cancel first.', 400);
    
    const startDate = new Date();
    const endDate = new Date();
    
    if (plan.billingCycle === BillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billingCycle === BillingCycle.QUARTERLY) {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan.billingCycle === BillingCycle.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Create in PENDING_PAYMENT state
    const membership = await UserMembership.create({
      customerId,
      planId,
      status: MembershipStatus.PENDING_PAYMENT,
      startDate,
      endDate,
      autoRenew: true
    });
    
    // In real app, we integrate Payment Gateway here to create order.
    // For now, we simulate returning a checkout session/order ID.
    return {
      membership,
      checkoutUrl: `https://checkout.SalonWala.com/pay/${membership._id}`
    };
  }

  /**
   * Activate membership (called after payment success)
   */
  static async activateMembership(membershipId: string, paymentId?: string) {
    const membership = await UserMembership.findById(membershipId);
    if (!membership) throw new AppError('Membership not found', 404);
    if (membership.status === MembershipStatus.ACTIVE) return membership; // Idempotency
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      membership.status = MembershipStatus.ACTIVE;
      if (paymentId) {
        membership.latestPaymentId = new mongoose.Types.ObjectId(paymentId);
      }
      await membership.save({ session });
      
      await MembershipHistory.create([{
        userMembershipId: membership._id,
        customerId: membership.customerId,
        action: MembershipAction.PURCHASED,
        newPlanId: membership.planId,
        initiatedBySystem: true
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      // Publish event
      EventBusService.publish('MembershipPurchased', {
        customerId: membership.customerId,
        planId: membership.planId,
        membershipId: membership._id
      }, 'MembershipEngine');
      
      return membership;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      logger.error(`[MembershipService] Failed to activate membership ${membershipId}`, error);
      throw new AppError('Failed to activate membership', 500);
    }
  }

  /**
   * Upgrade Membership
   */
  static async upgradeMembership(customerId: string, newPlanId: string) {
    const newPlan = await MembershipPlan.findById(newPlanId);
    if (!newPlan || !newPlan.isActive) throw new AppError('Plan not found', 404);
    
    const currentMembership = await UserMembership.findOne({ customerId, status: MembershipStatus.ACTIVE });
    if (!currentMembership) throw new AppError('No active membership found to upgrade', 404);
    
    const oldPlan = await MembershipPlan.findById(currentMembership.planId);
    if (oldPlan && oldPlan.price >= newPlan.price) {
      throw new AppError('Cannot upgrade to a cheaper or equal plan. Use downgrade instead.', 400);
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Deactivate old
      currentMembership.status = MembershipStatus.CANCELLED;
      currentMembership.autoRenew = false;
      await currentMembership.save({ session });
      
      // Setup new plan dates
      const startDate = new Date();
      const endDate = new Date();
      if (newPlan.billingCycle === BillingCycle.MONTHLY) endDate.setMonth(endDate.getMonth() + 1);
      else if (newPlan.billingCycle === BillingCycle.QUARTERLY) endDate.setMonth(endDate.getMonth() + 3);
      else if (newPlan.billingCycle === BillingCycle.YEARLY) endDate.setFullYear(endDate.getFullYear() + 1);
      
      const newMembership = await UserMembership.create([{
        customerId,
        planId: newPlan._id,
        status: MembershipStatus.ACTIVE, // Assuming immediate activation for MVP, real-world requires payment prorating
        startDate,
        endDate,
        autoRenew: true
      }], { session });
      
      await MembershipHistory.create([{
        userMembershipId: newMembership[0]._id,
        customerId,
        action: MembershipAction.UPGRADED,
        previousPlanId: currentMembership.planId,
        newPlanId: newPlan._id,
        notes: 'Upgraded membership plan'
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      EventBusService.publish('MembershipUpgraded', {
        customerId,
        oldPlanId: currentMembership.planId,
        newPlanId: newPlan._id
      }, 'MembershipEngine');
      
      return newMembership[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError('Failed to upgrade membership', 500);
    }
  }

  /**
   * Cancel Auto-Renew
   */
  static async cancelAutoRenew(customerId: string) {
    const membership = await UserMembership.findOne({ customerId, status: MembershipStatus.ACTIVE });
    if (!membership) throw new AppError('Active membership not found', 404);
    
    membership.autoRenew = false;
    await membership.save();
    
    await MembershipHistory.create({
      userMembershipId: membership._id,
      customerId,
      action: MembershipAction.CANCELLED,
      notes: 'Auto-renew cancelled by user'
    });
    
    return membership;
  }
}
