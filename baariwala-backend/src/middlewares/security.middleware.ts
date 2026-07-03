import { Request, Response, NextFunction } from 'express';
import { SecurityService } from '../services/security.service';
import { RateLimitRecord } from '../models/RateLimitRecord';
import { ThreatType } from '../models/ThreatLog';

export const ipBlockGuard = async (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  const isBlocked = await SecurityService.isIpBlocked(ip);
  if (isBlocked) {
    return res.status(403).json({ error: 'Access Denied. IP is blocked due to policy violations.' });
  }
  
  next();
};

/**
 * Distributed Rate Limiter
 */
export const rateLimiter = (maxHits: number, windowMinutes: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip || req.connection.remoteAddress || 'unknown';
      const endpoint = req.originalUrl;
      
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes() - windowStart.getMinutes() % windowMinutes);
      windowStart.setSeconds(0, 0);
      
      const windowEnd = new Date(windowStart);
      windowEnd.setMinutes(windowEnd.getMinutes() + windowMinutes);
      
      const record = await RateLimitRecord.findOneAndUpdate(
        { ipAddress: ip, endpoint, windowStart },
        { 
          $setOnInsert: { windowEnd },
          $inc: { hits: 1 } 
        },
        { upsert: true, new: true }
      );
      
      if (record.hits > maxHits) {
        await SecurityService.logThreat(ThreatType.RATE_LIMIT_EXCEEDED, ip, endpoint);
        return res.status(429).json({ error: 'Too Many Requests' });
      }
      
      next();
    } catch (error) {
      next(); // Fail open for rate limiter to prevent total outage if Redis/Mongo hiccup
    }
  };
};
