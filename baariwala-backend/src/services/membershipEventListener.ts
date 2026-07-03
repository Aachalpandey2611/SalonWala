import { EventBusService } from './eventBus.service';
import { MembershipService } from './membership.service';
import { UserMembership, MembershipStatus } from '../models/UserMembership';
import { logger } from '../utils/logger';

export function initializeMembershipEventListeners() {
  
  // Listen for PaymentCaptured to activate membership if it was a membership purchase
  EventBusService.subscribe('PaymentCaptured', 'MembershipEngine', async (payload: any) => {
    try {
      const { paymentId, metadata } = payload;
      
      // If the payment was specifically for a membership
      if (metadata && metadata.membershipId) {
        logger.info(`[MembershipEventListener] Payment captured for Membership ${metadata.membershipId}`);
        await MembershipService.activateMembership(metadata.membershipId, paymentId);
      }
    } catch (error) {
      logger.error(`[MembershipEventListener] Failed to process payment success for membership`, error);
    }
  });

  // A cron job or scheduled task would typically publish 'MembershipExpired'
  // But we can also listen to refunds to cancel memberships
  EventBusService.subscribe('RefundCompleted', 'MembershipEngine', async (payload: any) => {
    try {
      const { metadata } = payload;
      if (metadata && metadata.membershipId) {
        const membership = await UserMembership.findById(metadata.membershipId);
        if (membership && membership.status === MembershipStatus.ACTIVE) {
          membership.status = MembershipStatus.CANCELLED;
          membership.autoRenew = false;
          await membership.save();
          logger.info(`[MembershipEventListener] Cancelled membership ${membership._id} due to refund.`);
        }
      }
    } catch (error) {
      logger.error(`[MembershipEventListener] Failed to process refund for membership`, error);
    }
  });
}
