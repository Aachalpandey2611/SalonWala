import { NotificationTemplate } from '../models/NotificationTemplate';
import { NotificationPreference } from '../models/NotificationPreference';
import { Notification } from '../models/Notification';
import { NotificationDelivery, DeliveryStatus } from '../models/NotificationDelivery';
import { CommunicationLog } from '../models/CommunicationLog';
import { NotificationChannel, NotificationType } from '../models/NotificationChannel';
import { emailService } from '../utils/email.util';
import { fcmService } from '../utils/fcm.util';
import { User } from '../models/User';
import { logger } from '../utils/logger';

export class NotificationService {
  
  /**
   * Core Dispatch Engine
   */
  static async dispatch(
    userId: string, 
    type: NotificationType, 
    variables: Record<string, string>,
    referenceId?: string,
    referenceModel?: string
  ) {
    try {
      // 1. Fetch User & Preferences
      const user = await User.findById(userId);
      if (!user) {
        logger.warn(`[NotificationService] User ${userId} not found.`);
        return;
      }
      
      let pref = await NotificationPreference.findOne({ userId });
      if (!pref) {
        // Defaults
        pref = new NotificationPreference({ userId });
      }

      // Check DND
      if (pref.dndEnabled && pref.dndStartHour && pref.dndEndHour) {
        // Complex time check here. For MVP, we will skip Push/Email if DND is active and it's not a Booking Confirmation.
        if (type !== NotificationType.BOOKING_CONFIRMATION) {
            logger.info(`[NotificationService] User ${userId} is in DND. Skipping push/email for ${type}`);
            return;
        }
      }
      
      // 2. Resolve Template
      let template = await NotificationTemplate.findOne({ type, isActive: true });
      if (!template) {
        logger.warn(`[NotificationService] No active template found for ${type}. Using fallback.`);
        template = new NotificationTemplate({
          type,
          name: 'Fallback',
          subjectTemplate: `SalonWala Update: ${type}`,
          bodyTemplate: `You have a new update regarding: ${type}.`,
          isActive: true
        });
      }

      // 3. Render Template
      const subject = this.renderTemplate(template.subjectTemplate || '', variables);
      const body = this.renderTemplate(template.bodyTemplate, variables);
      
      // 4. Save In-App Notification (Always)
      await Notification.create({
        userId,
        type,
        title: subject || 'New Update',
        message: body,
        referenceId,
        referenceModel
      });

      // 5. Dispatch Email (if enabled and user has email)
      if (pref.emailEnabled && user.email) {
        await this.queueDelivery(userId, NotificationChannel.EMAIL, user.email, subject, body);
      }
      
      // 6. Dispatch Push (if enabled and user has FCM token)
      // Note: user.fcmToken needs to be added to User schema or passed in. Assuming it exists.
      if (pref.pushEnabled && (user as any).fcmToken) {
        await this.queueDelivery(userId, NotificationChannel.PUSH, (user as any).fcmToken, subject, body);
      }
      
    } catch (error) {
      logger.error(`[NotificationService] Failed to dispatch ${type} to ${userId}:`, error);
      throw error;
    }
  }

  private static renderTemplate(templateStr: string, variables: Record<string, string>): string {
    let rendered = templateStr;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, value);
    }
    return rendered;
  }

  private static async queueDelivery(userId: string, channel: NotificationChannel, address: string, subject: string, body: string) {
    const delivery = await NotificationDelivery.create({
      recipientId: userId,
      channel,
      targetAddress: address,
      subject,
      body,
      status: DeliveryStatus.QUEUED
    });
    
    // Process asynchronously (could be moved to a cron/worker)
    this.processDelivery(delivery._id.toString()).catch(e => logger.error(`[NotificationService] Delivery error for ${delivery._id}`, e));
  }

  private static async processDelivery(deliveryId: string) {
    const delivery = await NotificationDelivery.findById(deliveryId);
    if (!delivery) return;

    delivery.status = DeliveryStatus.PROCESSING;
    await delivery.save();

    try {
      if (delivery.channel === NotificationChannel.EMAIL) {
        await emailService.sendEmail(delivery.targetAddress, delivery.subject || 'SalonWala Notification', delivery.body);
      } else if (delivery.channel === NotificationChannel.PUSH) {
        await fcmService.sendPushNotification(delivery.targetAddress, delivery.subject || 'SalonWala Notification', delivery.body);
      }
      
      delivery.status = DeliveryStatus.DELIVERED;
      delivery.deliveryTimestamp = new Date();
      await delivery.save();
      
      // Move to CommunicationLog
      await this.archiveLog(delivery);
      
    } catch (error: any) {
      delivery.retryCount += 1;
      delivery.failureReason = error.message;
      
      if (delivery.retryCount >= delivery.maxRetries) {
        delivery.status = DeliveryStatus.FAILED;
        await this.archiveLog(delivery);
      } else {
        delivery.status = DeliveryStatus.QUEUED; // Re-queue
      }
      
      await delivery.save();
    }
  }
  
  private static async archiveLog(delivery: any) {
    await CommunicationLog.create({
      recipientId: delivery.recipientId,
      channel: delivery.channel,
      subject: delivery.subject,
      bodySnapshot: delivery.body,
      finalStatus: delivery.status,
      totalRetries: delivery.retryCount,
      terminalFailureReason: delivery.failureReason,
      completedAt: new Date()
    });
    
    await NotificationDelivery.findByIdAndDelete(delivery._id);
  }
}
