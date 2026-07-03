import { Role } from '../models/Role';
import { Permission, DataScope } from '../models/Permission';
import { UserRole } from '../models/UserRole';
import { RoleHierarchy } from '../models/RoleHierarchy';
import { PermissionAudit, PermissionAuditAction } from '../models/PermissionAudit';
import { redisClient } from '../config/redis';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export class RBACService {
  
  /**
   * Resolves a user's total permissions including hierarchical inheritance.
   * Checks Redis cache first.
   */
  static async getUserPermissions(userId: string, tenantId?: string) {
    const cacheKey = tenantId ? `user:${userId}:tenant:${tenantId}:permissions` : `user:${userId}:global:permissions`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // 1. Fetch UserRoles for context
    const query: any = { userId };
    if (tenantId) query.tenantId = tenantId;
    
    const userRoles = await UserRole.find(query).populate('roleId');
    if (!userRoles.length) return [];

    const roleIds = userRoles.map(ur => (ur.roleId as any)._id);
    
    // 2. Resolve Role Hierarchy (Fetch inherited roles)
    const allRoleIds = await this.resolveRoleHierarchy(roleIds);

    // 3. Fetch Permissions
    const roles = await Role.find({ _id: { $in: allRoleIds }, isActive: true }).populate('permissions');
    
    const permissionsMap = new Map<string, any>();
    
    roles.forEach(role => {
      (role.permissions as any[]).forEach(perm => {
        // Higher scopes override lower scopes
        if (!permissionsMap.has(perm.code) || this.isScopeHigher(perm.scope, permissionsMap.get(perm.code).scope)) {
          permissionsMap.set(perm.code, perm);
        }
      });
    });

    const resolvedPermissions = Array.from(permissionsMap.values());

    if (redisClient) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(resolvedPermissions)); // Cache for 1 hour
    }

    return resolvedPermissions;
  }

  /**
   * Clears the RBAC cache for a specific user
   */
  static async invalidateUserCache(userId: string) {
    if (!redisClient) return;
    const keys = await redisClient.keys(`user:${userId}:*permissions`);
    if (keys.length) {
      await redisClient.del(keys);
    }
  }

  /**
   * Resolves parent roles downward
   */
  private static async resolveRoleHierarchy(baseRoleIds: mongoose.Types.ObjectId[]): Promise<mongoose.Types.ObjectId[]> {
    const resolvedIds = new Set<string>(baseRoleIds.map(id => id.toString()));
    
    let currentParents = [...baseRoleIds];
    
    while (currentParents.length > 0) {
      const hierarchies = await RoleHierarchy.find({ parentRoleId: { $in: currentParents } });
      const childIds = hierarchies.map(h => h.childRoleId);
      
      currentParents = [];
      for (const childId of childIds) {
        if (!resolvedIds.has(childId.toString())) {
          resolvedIds.add(childId.toString());
          currentParents.push(childId);
        }
      }
    }
    
    return Array.from(resolvedIds).map(id => new mongoose.Types.ObjectId(id));
  }

  /**
   * Helper to determine scope supremacy
   */
  private static isScopeHigher(scopeA: DataScope, scopeB: DataScope) {
    const weights = {
      [DataScope.SELF]: 1,
      [DataScope.BRANCH]: 2,
      [DataScope.ORGANIZATION]: 3,
      [DataScope.TENANT]: 4,
      [DataScope.GLOBAL]: 5
    };
    return weights[scopeA] > weights[scopeB];
  }
}
