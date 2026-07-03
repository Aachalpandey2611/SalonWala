import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const authSchemas = {
  signup: z.object({
    body: z.object({
      fullName: z.string().min(2, 'Full name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      phone: z.string().min(10, 'Invalid phone number').optional(),
      password: z
        .string()
        .regex(
          passwordRegex,
          'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character'
        ),
      role: z.enum(['Customer', 'Barber', 'SalonOwner']).optional(), // Admin roles created separately
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address').optional(),
      phone: z.string().min(10, 'Invalid phone number').optional(),
      password: z.string().min(1, 'Password is required'),
    }).refine((data) => data.email || data.phone, {
      message: 'Either email or phone is required for login',
      path: ['email'],
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'Token is required'),
      newPassword: z
        .string()
        .regex(
          passwordRegex,
          'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character'
        ),
    }),
  }),

  googleLogin: z.object({
    body: z.object({
      idToken: z.string().min(1, 'Google ID Token is required'),
    }),
  }),

  sendOtp: z.object({
    body: z.object({
      phone: z.string().min(10, 'Invalid phone number'),
    }),
  }),

  verifyOtp: z.object({
    body: z.object({
      phone: z.string().min(10, 'Invalid phone number'),
      otp: z.string().length(4, 'OTP must be 4 digits'),
    }),
  }),
};
