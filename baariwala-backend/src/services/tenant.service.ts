import { Tenant, TenantStatus } from '../models/Tenant';
import { Organization, OrganizationType } from '../models/Organization';
import { BranchHierarchy, HierarchyLevel } from '../models/BranchHierarchy';
import { TenantConfiguration } from '../models/TenantConfiguration';
import { TenantSubscription, SubscriptionPlan, SubscriptionStatus } from '../models/TenantSubscription';
import { OrganizationAudit, OrgAuditAction } from '../models/OrganizationAudit';
import { redisClient } from '../config/redis';
import mongoose from 'mongoose';
import { AppError } from '../utils/AppError';

export class TenantService {
  /**
   * Complete Tenant Onboarding Pipeline
   */
  static async createTenantPipeline(ownerId: string, tenantName: string, email: string, plan: SubscriptionPlan) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Create Tenant
      const tenant = await Tenant.create([{
        name: tenantName,
        ownerId,
        contactEmail: email,
        status: TenantStatus.ACTIVE
      }], { session });

      const tenantId = tenant[0]._id;

      // 2. Create Root Organization
      const org = await Organization.create([{
        tenantId,
        name: tenantName,
        type: OrganizationType.SINGLE_SALON
      }], { session });

      // 3. Create Default Configuration
      await TenantConfiguration.create([{
        tenantId,
        currency: 'USD',
        timezone: 'UTC'
      }], { session });

      // 4. Create Subscription
      await TenantSubscription.create([{
        tenantId,
        planName: plan,
        status: SubscriptionStatus.ACTIVE,
        billingCycle: 'MONTHLY',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        limits: {
          maxUsers: plan === SubscriptionPlan.STARTER ? 5 : 50,
          maxBranches: plan === SubscriptionPlan.STARTER ? 1 : 10,
          storageLimitMb: 1000,
          apiRateLimit: 60
        }
      }], { session });

      // 5. Audit
      await OrganizationAudit.create([{
        tenantId,
        action: OrgAuditAction.TENANT_CREATED,
        performedBy: ownerId,
        details: { plan }
      }], { session });

      await session.commitTransaction();
      return tenant[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Validates if a tenant has exceeded their branch limit before creating a new one
   */
  static async validateBranchLimit(tenantId: string) {
    const sub = await TenantSubscription.findOne({ tenantId });
    if (!sub) throw new AppError('Subscription not found', 404);

    if (sub.currentUsage.activeBranches >= sub.limits.maxBranches) {
      throw new AppError(`Branch limit exceeded for plan ${sub.planName}`, 403);
    }
    return true;
  }

  /**
   * Retrieves Cached Tenant Configuration
   */
  static async getTenantConfiguration(tenantId: string) {
    const cacheKey = `tenant:config:${tenantId}`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const config = await TenantConfiguration.findOne({ tenantId });
    if (!config) throw new AppError('Configuration not found', 404);

    if (redisClient) {
      await redisClient.setex(cacheKey, 86400, JSON.stringify(config)); // 24 hours
    }

    return config;
  }
}
