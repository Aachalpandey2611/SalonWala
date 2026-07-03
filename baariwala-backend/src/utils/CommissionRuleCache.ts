import { redisClient } from '../config/redis';
import { CommissionRule, ICommissionRule } from '../models/CommissionRule';
import { logger } from '../utils/logger';

export class CommissionRuleCache {
  private static readonly TTL_SECONDS = 3600; // 1 hour

  private static getCacheKey(salonId: string): string {
    return `commission_rules:salon:${salonId}`;
  }

  /**
   * Fetches active rules from cache, or DB if missing.
   */
  static async getActiveRulesForSalon(salonId: string): Promise<ICommissionRule[]> {
    const key = this.getCacheKey(salonId);
    try {
      if (redisClient) {
        const cached = await redisClient.get(key);
        if (cached) {
          return JSON.parse(cached);
        }
      }
      
      const rules = await CommissionRule.find({ salonId, isActive: true }).sort({ priority: -1, createdAt: -1 });
      
      if (redisClient) {
        await redisClient.setex(key, this.TTL_SECONDS, JSON.stringify(rules));
      }
      return rules;
    } catch (error) {
      logger.error(`[CommissionRuleCache] Failed to fetch rules for salon ${salonId}`, error);
      // Fallback to DB
      return await CommissionRule.find({ salonId, isActive: true }).sort({ priority: -1, createdAt: -1 });
    }
  }

  /**
   * Invalidates cache for a specific salon.
   */
  static async invalidateRulesCache(salonId: string): Promise<void> {
    if (!redisClient) return;
    try {
      const key = this.getCacheKey(salonId);
      await redisClient.del(key);
      logger.info(`[CommissionRuleCache] Invalidated cache for salon ${salonId}`);
    } catch (error) {
      logger.error(`[CommissionRuleCache] Failed to invalidate cache for salon ${salonId}`, error);
    }
  }
}
