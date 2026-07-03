import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { UserRole } from '../constants/roles';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  try {
    const decoded: any = jwt.verify(token, env.jwt.secret);
    req.user = decoded; // we will define this in express types
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

/**
 * Enterprise RBAC Guard
 * Checks if the authenticated user has the required permission code (e.g. "booking.create.branch")
 */
import { RBACService } from '../services/rbac.service';

export const requirePermission = (requiredCode: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as any;
      if (!user) {
        return next(new AppError('Unauthorized - Please log in', 401));
      }

      // Bypass for Super Admins
      if (user.role === UserRole.SUPER_ADMIN) {
        return next();
      }

      const permissions = await RBACService.getUserPermissions(user.id, user.tenantId);
      
      const hasPermission = permissions.some((p: any) => p.code === requiredCode);
      
      if (!hasPermission) {
        // Log failed authorization attempt in production
        return next(new AppError(`Forbidden - Missing required permission: ${requiredCode}`, 403));
      }
      
      next();
    } catch (error) {
      next(new AppError('Authorization engine failure', 500));
    }
  };
};
