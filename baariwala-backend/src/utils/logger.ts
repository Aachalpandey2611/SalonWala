import winston from 'winston';
import { env } from '../config/env';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  level: env.nodeEnv === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'info.log') 
    }),
  ],
});

// If we're not in production then log to the `console`
if (env.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ level, message }) => `${level}: ${message}`)
    )
  }));
}
