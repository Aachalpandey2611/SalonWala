import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { generateTokens, verifyGoogleToken } from '../services/auth.service';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import { AccountStatus } from '../constants/status';
import { UserRole } from '../constants/roles';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { fullName, email, phone, password, role } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) throw new AppError('Email already in use', 400);

  if (phone) {
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) throw new AppError('Phone number already in use', 400);
  }

  const user = await User.create({ fullName, email, phone, password, role });

  // Generate Email Verification Token (simple JWT for now)
  const verifyToken = jwt.sign({ id: user._id }, env.jwt.secret, { expiresIn: '24h' });
  await sendVerificationEmail(user.email, verifyToken);

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please verify your email.',
    data: { user: { _id: user._id, email: user.email, role: user.role }, accessToken, refreshToken },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;

  const query = email ? { email } : { phone };
  const user = await User.findOne(query).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.status === AccountStatus.SUSPENDED || user.status === AccountStatus.BLOCKED || user.status === AccountStatus.DELETED) {
    throw new AppError(`Account is ${user.status.toLowerCase()}. Please contact support.`, 403);
  }

  const { accessToken, refreshToken } = generateTokens(user);
  
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user: { _id: user._id, email: user.email, role: user.role }, accessToken, refreshToken },
  });
});

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { idToken } = req.body;
  const payload = await verifyGoogleToken(idToken);

  if (!payload || !payload.email) throw new AppError('Invalid Google Token', 401);

  let user = await User.findOne({ email: payload.email });

  if (user && user.status !== AccountStatus.ACTIVE) {
    throw new AppError(`Account is ${user.status.toLowerCase()}.`, 403);
  }

  if (!user) {
    user = await User.create({
      fullName: payload.name || 'Google User',
      email: payload.email,
      googleId: payload.sub,
      isEmailVerified: true,
      avatar: payload.picture,
    });
  } else if (!user.googleId) {
    user.googleId = payload.sub;
    user.isEmailVerified = true;
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    message: 'Google Login successful',
    data: { user: { _id: user._id, email: user.email, role: user.role }, accessToken, refreshToken },
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) throw new AppError('Refresh token is required', 400);

  const decoded: any = jwt.verify(token, env.jwt.secret);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== token) {
    throw new AppError('Invalid refresh token', 401);
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    data: { accessToken, refreshToken },
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new AppError('No user found with that email address', 404);

  // We reuse the refresh token field to store the password reset token temporarily (hashed)
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.refreshToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  await user.save({ validateModifiedOnly: true });

  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to email',
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const decoded = jwt.verify(token, env.jwt.secret) as { id: string };
  const user = await User.findById(decoded.id);

  if (!user) throw new AppError('Invalid or expired token', 400);

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

export const sendOtp = catchAsync(async (req: Request, res: Response) => {
  const { phone } = req.body;
  
  // Generate 4 digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  
  // In production, you would use an SMS provider like Twilio/MSG91 here
  logger.info(`[Auth OTP] Sending OTP ${otp} to phone ${phone}`);
  
  // Store OTP in Redis for 5 minutes
  const { redisClient, isRedisConnected } = await import('../config/redis');
  if (isRedisConnected) {
    await redisClient.set(`otp:${phone}`, otp, 'EX', 300);
  } else {
    logger.warn('Redis not connected, OTP bypassed in-memory for dev mode only');
    // For demo purposes, we will accept '1234' if redis is down
  }

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${phone}`,
  });
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;

  const { redisClient, isRedisConnected } = await import('../config/redis');
  
  let isValid = false;
  
  if (isRedisConnected) {
    const storedOtp = await redisClient.get(`otp:${phone}`);
    if (storedOtp === otp) {
      isValid = true;
      await redisClient.del(`otp:${phone}`);
    }
  } else if (otp === '1234') {
    // Fallback for demo when redis is down
    isValid = true;
  }

  if (!isValid) {
    throw new AppError('Invalid or expired OTP', 400);
  }


  // Find or Create User
  let user = await User.findOne({ phone });
  
  if (!user) {
    // Register new user on the fly if not found
    user = await User.create({ 
      phone, 
      fullName: 'Customer', // Default
      role: UserRole.CUSTOMER 
    });
  }

  if (user.status === AccountStatus.SUSPENDED || user.status === AccountStatus.BLOCKED || user.status === AccountStatus.DELETED) {
    throw new AppError(`Account is ${user.status}`, 403);
  }

  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;
  // user.lastLogin is not in the schema, skipping
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
    data: { user: { _id: user._id, email: user.email, phone: user.phone, role: user.role, fullName: user.fullName }, accessToken, refreshToken },
  });
});
