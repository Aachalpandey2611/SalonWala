import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const mailOptions = {
      from: env.smtp.from,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`❌ Error sending email to ${to}:`, error);
  }
};

export const sendVerificationEmail = async (to: string, token: string) => {
  const subject = 'Verify your SalonWala account';
  const verifyUrl = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`; // In production, this would be a frontend URL
  const html = `
    <h1>Welcome to SalonWala!</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;
  await sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const subject = 'Reset your SalonWala password';
  const resetUrl = `http://localhost:5000/reset-password?token=${token}`; // Frontend URL
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password. Click the link below to set a new password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  await sendEmail(to, subject, html);
};
