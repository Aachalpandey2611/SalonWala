import { AuditLog, AuditStatus } from '../models/AuditLog';
import { SecurityEvent, SecurityEventType, SecuritySeverity } from '../models/SecurityEvent';
import { LoginHistory, LoginStatus } from '../models/LoginHistory';
import { logger } from '../utils/logger';

export class AuditService {
  
  static async logAction(payload: {
    tenantId?: string;
    branchId?: string;
    userId?: string;
    module: string;
    action: string;
    resourceId?: string;
    resourceModel?: string;
    status: AuditStatus;
    ipAddress?: string;
    userAgent?: string;
    details?: any;
  }) {
    try {
      await AuditLog.create(payload);
    } catch (error) {
      logger.error('Failed to insert AuditLog. Critical logging failure.', error);
    }
  }

  static async logSecurityEvent(payload: {
    tenantId?: string;
    userId?: string;
    eventType: SecurityEventType;
    severity: SecuritySeverity;
    description: string;
    ipAddress: string;
  }) {
    try {
      await SecurityEvent.create(payload);
      
      // If critical, we would also trigger immediate Webhook/Email alerts here
      if (payload.severity === SecuritySeverity.CRITICAL) {
        logger.warn(`CRITICAL SECURITY EVENT: ${payload.description} [IP: ${payload.ipAddress}]`);
      }
    } catch (error) {
      logger.error('Failed to insert SecurityEvent.', error);
    }
  }

  static async trackLoginAttempt(
    email: string,
    ipAddress: string,
    userAgent: string,
    status: LoginStatus,
    userId?: string,
    tenantId?: string
  ) {
    try {
      await LoginHistory.create({
        userId,
        emailAttempted: email,
        tenantId,
        status,
        device: this.parseDevice(userAgent),
        browser: this.parseBrowser(userAgent),
        ipAddress,
        loginTime: new Date()
      });
    } catch (error) {
      logger.error('Failed to log LoginHistory.', error);
    }
  }

  // Simple string parsers for mocking, a real system uses 'ua-parser-js'
  private static parseDevice(userAgent: string) {
    if (userAgent.includes('Mobile')) return 'Mobile Device';
    return 'Desktop/Laptop';
  }

  private static parseBrowser(userAgent: string) {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Unknown Browser';
  }
}
