import { PlatformSetting, SettingLevel } from '../models/PlatformSetting';
import { FeatureFlag } from '../models/FeatureFlag';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class ConfigService {
  
  /**
   * Resolves a configuration value across hierarchical levels.
   * Priority: Branch > Tenant > Global
   */
  static async resolveSetting(key: string, tenantId?: string, branchId?: string) {
    const cacheKey = `config:${key}:t:${tenantId || 'global'}:b:${branchId || 'global'}`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // Fetch all applicable levels
    const queries = [{ key, level: SettingLevel.GLOBAL }];
    if (tenantId) queries.push({ key, level: SettingLevel.TENANT, tenantId } as any);
    if (branchId) queries.push({ key, level: SettingLevel.BRANCH, branchId } as any);

    const settings = await PlatformSetting.find({ $or: queries });
    
    let resolvedValue = null;
    let highestWeight = 0; // 1=Global, 2=Tenant, 3=Branch
    
    settings.forEach(s => {
      let weight = 0;
      if (s.level === SettingLevel.GLOBAL) weight = 1;
      if (s.level === SettingLevel.TENANT) weight = 2;
      if (s.level === SettingLevel.BRANCH) weight = 3;
      
      if (weight > highestWeight) {
        highestWeight = weight;
        resolvedValue = s.value;
      }
    });

    if (redisClient && resolvedValue !== null) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(resolvedValue));
    }

    return resolvedValue;
  }

  /**
   * Evaluates if a feature flag is enabled for a specific tenant
   */
  static async isFeatureEnabled(key: string, tenantId?: string) {
    const cacheKey = `flag:${key}:t:${tenantId || 'global'}`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return cached === 'true';
    }

    const flag = await FeatureFlag.findOne({ key });
    if (!flag) return false;

    let isEnabled = flag.isEnabledGlobally;

    if (tenantId) {
      if (flag.disabledForTenants.some(id => id.toString() === tenantId)) {
        isEnabled = false;
      } else if (flag.enabledForTenants.some(id => id.toString() === tenantId)) {
        isEnabled = true;
      }
    }

    if (redisClient) {
      await redisClient.setex(cacheKey, 3600, isEnabled ? 'true' : 'false');
    }

    return isEnabled;
  }
}
