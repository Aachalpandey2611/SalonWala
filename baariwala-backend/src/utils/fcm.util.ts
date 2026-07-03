import admin from 'firebase-admin';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { logger } from './logger';
import { env } from '../config/env';

// Wrap Firebase Admin for Push Notifications
class FCMService {
  private isMock = false;

  constructor() {
    try {
      if (env.firebase.projectId && env.firebase.privateKey && env.firebase.clientEmail) {
        initializeApp({
          credential: cert({
            projectId: env.firebase.projectId,
            privateKey: env.firebase.privateKey.replace(/\\n/g, '\n'),
            clientEmail: env.firebase.clientEmail,
          }),
        });
        logger.info('[FCMService] Firebase Admin Initialized.');
      } else {
        logger.warn('[FCMService] Missing Firebase Credentials. Running in MOCK mode.');
        this.isMock = true;
      }
    } catch (e) {
      logger.warn('[FCMService] Failed to initialize Firebase Admin. Running in MOCK mode.', e);
      this.isMock = true;
    }
  }

  async sendPushNotification(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<boolean> {
    if (this.isMock) {
      logger.info(`[FCMService - MOCK] Sent Push to: ${fcmToken} | Title: ${title}`);
      return true; // Simulate success
    }

    try {
      const response = await getMessaging().send({
        token: fcmToken,
        notification: {
          title,
          body,
        },
        data,
      });
      
      logger.info(`[FCMService] Sent Push successfully: ${response}`);
      return true;
    } catch (error) {
      logger.error(`[FCMService] Failed to send push to ${fcmToken}:`, error);
      throw error;
    }
  }
}

export const fcmService = new FCMService();
