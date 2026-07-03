import { DeviceSession } from '../models/DeviceSession';
import { ThreatLog, ThreatType } from '../models/ThreatLog';
import { BlockedIP } from '../models/BlockedIP';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';
import crypto from 'crypto';

export class SecurityService {
  
  /**
   * Register a new device session during Login
   */
  static async registerSession(userId: string, ipAddress: string, userAgent: string) {
    const sessionToken = crypto.randomUUID();
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry
    
    const session = await DeviceSession.create({
      userId,
      sessionToken,
      deviceInfo: userAgent,
      ipAddress,
      expiresAt
    });

    if (redisClient) {
      // Store in redis for ultra-fast lookup by auth middleware
      await redisClient.setex(`session:${sessionToken}`, 7 * 24 * 3600, userId);
    }
    
    return sessionToken;
  }

  /**
   * Checks if an IP is blocked
   */
  static async isIpBlocked(ipAddress: string): Promise<boolean> {
    if (redisClient) {
      const isBlocked = await redisClient.get(`blocked_ip:${ipAddress}`);
      if (isBlocked) return true;
    }
    
    const block = await BlockedIP.findOne({ ipAddress });
    if (block) {
      if (redisClient) await redisClient.setex(`blocked_ip:${ipAddress}`, 3600, 'true');
      return true;
    }
    return false;
  }

  /**
   * Log a security threat and auto-ban IP if severe
   */
  static async logThreat(type: ThreatType, ipAddress: string, endpoint: string, userId?: string, payload?: any) {
    try {
      await ThreatLog.create({ type, ipAddress, endpoint, userId, payload });
      logger.warn(`[SECURITY THREAT] ${type} from ${ipAddress} at ${endpoint}`);
      
      // Auto ban brute force
      if (type === ThreatType.RATE_LIMIT_EXCEEDED) {
        await this.blockIp(ipAddress, 'Automated Ban: Rate Limit Exceeded');
      }
    } catch (error) {
      logger.error('Failed to log threat', error);
    }
  }

  static async blockIp(ipAddress: string, reason: string) {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour ban
      
      await BlockedIP.findOneAndUpdate(
        { ipAddress },
        { reason, expiresAt },
        { upsert: true }
      );
      
      if (redisClient) {
        await redisClient.setex(`blocked_ip:${ipAddress}`, 24 * 3600, 'true');
      }
      
      logger.warn(`[SECURITY] Blocked IP ${ipAddress}. Reason: ${reason}`);
    } catch (error) {
      logger.error('Failed to block IP', error);
    }
  }

  static async revokeSession(sessionToken: string) {
    await DeviceSession.findOneAndUpdate({ sessionToken }, { isRevoked: true });
    if (redisClient) {
      await redisClient.del(`session:${sessionToken}`);
    }
  }
}
