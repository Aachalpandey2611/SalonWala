import Redis from 'ioredis';
import { env } from './env';
import { logger } from '../utils/logger';

// State flag to allow the app to gracefully disable caching features
export let isRedisConnected = false;

export const redisClient = new Redis(env.redisUri, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    // Retry up to 3 times, then give up so app continues without cache
    if (times > 3) {
      return null; 
    }
    return Math.min(times * 1000, 3000);
  }
});

redisClient.on('error', (_err) => {
  if (isRedisConnected) {
    logger.warn('⚠️ Redis connection lost. Caching is disabled temporarily.');
  }
  isRedisConnected = false;
});

redisClient.on('connect', () => {
  isRedisConnected = true;
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('✅ Successfully connected to Redis');
  } catch (error: any) {
    // WE DO NOT exit the process here. The app should run without cache.
    logger.error('❌ Error connecting to Redis. Proceeding without caching layer:', error.message);
  }
};
