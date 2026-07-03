import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDatabase = async (retryCount = 1): Promise<void> => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ Successfully connected to MongoDB Atlas');
  } catch (error: any) {
    logger.error(`❌ Error connecting to MongoDB (Attempt ${retryCount}/${MAX_RETRIES}):`, error.message);
    
    if (retryCount < MAX_RETRIES) {
      logger.info(`Retrying connection in ${RETRY_DELAY_MS / 1000} seconds...`);
      setTimeout(() => connectDatabase(retryCount + 1), RETRY_DELAY_MS);
    } else {
      logger.error('❌ Max connection retries reached. Exiting application.');
      process.exit(1);
    }
  }
};
