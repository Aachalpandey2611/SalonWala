import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { AuditService } from './audit.service';
import { AuditStatus } from '../models/AuditLog';
import { SecurityEventType, SecuritySeverity } from '../models/SecurityEvent';
import { LoginStatus } from '../models/LoginHistory';

export const setupAuditEventListeners = () => {
  
  EventBusService.subscribe('BookingCreated', 'AuditEngine', async (payload: any) => {
    try {
      await AuditService.logAction({
        tenantId: payload.tenantId,
        branchId: payload.branchId,
        userId: payload.customerId,
        module: 'BOOKING',
        action: 'CREATE',
        resourceId: payload.bookingId,
        resourceModel: 'Booking',
        status: AuditStatus.SUCCESS,
        details: payload
      });
    } catch (error) {
      logger.error('AuditEngine error on BookingCreated', error);
    }
  });

  EventBusService.subscribe('LoginAttempt', 'AuditEngine', async (payload: any) => {
    try {
      await AuditService.trackLoginAttempt(
        payload.email,
        payload.ipAddress,
        payload.userAgent,
        payload.success ? LoginStatus.SUCCESS : LoginStatus.FAILED,
        payload.userId,
        payload.tenantId
      );

      if (!payload.success) {
        await AuditService.logSecurityEvent({
          tenantId: payload.tenantId,
          userId: payload.userId,
          eventType: SecurityEventType.SUSPICIOUS_LOGIN,
          severity: SecuritySeverity.LOW,
          description: `Failed login attempt for ${payload.email}`,
          ipAddress: payload.ipAddress
        });
      }
    } catch (error) {
      logger.error('AuditEngine error on LoginAttempt', error);
    }
  });

};
