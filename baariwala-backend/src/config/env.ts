import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, 'MongoDB connection string is required'),
  REDIS_URI: z.string().min(1, 'Redis connection string is required'),
  JWT_SECRET: z.string().min(1, 'JWT Secret Key is required'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SMTP_HOST: z.string().min(1, 'SMTP Host is required'),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().min(1, 'SMTP User is required'),
  SMTP_PASS: z.string().min(1, 'SMTP Pass is required'),
  SMTP_FROM: z.string().min(1, 'SMTP From is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'Google Client ID is required'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'Cloudinary Cloud Name is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'Cloudinary API Key is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'Cloudinary API Secret is required'),
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  mongoUri: parsedEnv.data.MONGO_URI,
  redisUri: parsedEnv.data.REDIS_URI,
  jwt: {
    secret: parsedEnv.data.JWT_SECRET,
    expiresIn: parsedEnv.data.JWT_EXPIRES_IN,
  },
  smtp: {
    host: parsedEnv.data.SMTP_HOST,
    port: parsedEnv.data.SMTP_PORT,
    user: parsedEnv.data.SMTP_USER,
    pass: parsedEnv.data.SMTP_PASS,
    from: parsedEnv.data.SMTP_FROM,
  },
  google: {
    clientId: parsedEnv.data.GOOGLE_CLIENT_ID,
  },
  cloudinary: {
    cloudName: parsedEnv.data.CLOUDINARY_CLOUD_NAME,
    apiKey: parsedEnv.data.CLOUDINARY_API_KEY,
    apiSecret: parsedEnv.data.CLOUDINARY_API_SECRET,
  },
  firebase: {
    projectId: parsedEnv.data.FIREBASE_PROJECT_ID,
    privateKey: parsedEnv.data.FIREBASE_PRIVATE_KEY,
    clientEmail: parsedEnv.data.FIREBASE_CLIENT_EMAIL,
  },
  razorpay: {
    keyId: parsedEnv.data.RAZORPAY_KEY_ID,
    keySecret: parsedEnv.data.RAZORPAY_KEY_SECRET,
    webhookSecret: parsedEnv.data.RAZORPAY_WEBHOOK_SECRET,
  }
};
