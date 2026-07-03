import { Request, Response, NextFunction } from 'express';
import { VersionService } from '../services/version.service';
import { ClientPlatform } from '../models/ClientCompatibility';
import { AppError } from '../utils/AppError';

/**
 * Intercepts requests, parses API version, and injects Deprecation Headers if applicable
 */
export const versionGuard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const versionMatch = req.originalUrl.match(/\/api\/(v\d+)\//);
    const apiVersion = versionMatch ? versionMatch[1] : req.headers['accept-version'] as string || 'v1';
    
    const status = await VersionService.getVersionStatus(apiVersion);
    
    if (status) {
      if (status.isRetired) {
        return res.status(410).json({
          error: 'API Version Retired',
          message: `The ${apiVersion} API has been permanently retired. Please upgrade your client.`
        });
      }
      
      if (status.isDeprecated) {
        res.setHeader('X-API-Warn', `Deprecated API. This version will sunset on ${status.sunsetDate}`);
      }
    }
    
    // Check Client App Compatibility header (e.g. "X-Client-Version: IOS 1.2.0")
    const clientHeader = req.headers['x-client-version'] as string;
    if (clientHeader) {
      const [platformStr, appVersion] = clientHeader.split(' ');
      const platform = platformStr.toUpperCase() as ClientPlatform;
      
      if (Object.values(ClientPlatform).includes(platform) && appVersion) {
        const compat = await VersionService.checkClientCompatibility(platform, appVersion);
        
        if (compat.forceUpdate) {
          return res.status(426).json({
            error: 'Upgrade Required',
            message: `Your App version is no longer supported. Please update to ${compat.latestAvailable}`
          });
        }
        
        if (compat.needsWarning) {
          res.setHeader('X-App-Update-Warn', 'A newer version of the app is available. Please update soon.');
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
