import { ApiVersion, ApiLifecycle } from '../models/ApiVersion';
import { ClientCompatibility, ClientPlatform } from '../models/ClientCompatibility';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class VersionService {
  
  /**
   * Checks if an API version is deprecated and appends warning headers if necessary.
   */
  static async getVersionStatus(version: string) {
    const cacheKey = `api_version:${version}`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }
    
    const apiVersion = await ApiVersion.findOne({ version });
    if (!apiVersion) return null;
    
    const statusData = {
      status: apiVersion.status,
      sunsetDate: apiVersion.sunsetDate,
      isDeprecated: apiVersion.status === ApiLifecycle.DEPRECATED,
      isRetired: apiVersion.status === ApiLifecycle.RETIRED
    };
    
    if (redisClient) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(statusData)); // Cache 1hr
    }
    
    return statusData;
  }

  /**
   * Evaluates if a mobile client version is still supported
   */
  static async checkClientCompatibility(platform: ClientPlatform, appVersion: string) {
    const cacheKey = `client_compat:${platform}`;
    
    let compatData;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) compatData = JSON.parse(cached);
    }
    
    if (!compatData) {
      const dbCompat = await ClientCompatibility.findOne({ platform });
      if (!dbCompat) return { isSupported: true, forceUpdate: false };
      
      compatData = {
        minSupported: dbCompat.minSupportedVersion,
        warningThreshold: dbCompat.deprecationWarningThreshold,
        latest: dbCompat.latestVersion
      };
      
      if (redisClient) {
        await redisClient.setex(cacheKey, 3600, JSON.stringify(compatData));
      }
    }
    
    // Simple semantic versioning check (assumes "1.2.0" format)
    const isSupported = this.compareVersions(appVersion, compatData.minSupported) >= 0;
    const needsWarning = this.compareVersions(appVersion, compatData.warningThreshold) < 0;
    
    return {
      isSupported,
      forceUpdate: !isSupported,
      needsWarning,
      latestAvailable: compatData.latest
    };
  }

  /**
   * Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
   */
  private static compareVersions(v1: string, v2: string) {
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if ((p1[i] || 0) > (p2[i] || 0)) return 1;
      if ((p1[i] || 0) < (p2[i] || 0)) return -1;
    }
    return 0;
  }
}
