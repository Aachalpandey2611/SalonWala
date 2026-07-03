import nodemailer from 'nodemailer';
import { logger } from './logger';
import { env } from '../config/env';

// Wrap Nodemailer in a safe structure. If credentials are missing, we mock the delivery.
class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isMock = false;

  constructor() {
    if (env.smtp.host && env.smtp.user && env.smtp.pass) {
      this.transporter = nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port || 587,
        secure: env.smtp.port === 465,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass,
        },
      });
      logger.info('[EmailService] Configured Nodemailer Transporter.');
    } else {
      logger.warn('[EmailService] Missing SMTP Credentials. Running in MOCK mode.');
      this.isMock = true;
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    if (this.isMock) {
      logger.info(`[EmailService - MOCK] Sent to: ${to} | Subject: ${subject}`);
      return true; // Simulate success
    }

    try {
      const info = await this.transporter!.sendMail({
        from: env.smtp.from || '"SalonWala" <noreply@SalonWala.com>',
        to,
        subject,
        html,
      });
      
      logger.info(`[EmailService] Sent to: ${to} | MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      logger.error(`[EmailService] Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}

export const emailService = new EmailService();
