import mongoose, { Document, Schema } from 'mongoose';

export enum OrganizationType {
  SINGLE_SALON = 'SINGLE_SALON',
  MULTI_BRANCH = 'MULTI_BRANCH',
  ENTERPRISE_CHAIN = 'ENTERPRISE_CHAIN',
  FRANCHISE_NETWORK = 'FRANCHISE_NETWORK'
}

export interface IOrganization extends Document {
  tenantId: mongoose.Types.ObjectId; // Strict Tenant Isolation
  
  name: string; // E.g., "Tony's Salons Inc."
  type: OrganizationType;
  
  parentOrganizationId?: mongoose.Types.ObjectId; // For Franchise Networks with sub-organizations
  
  headquartersAddress?: string;
  
  businessRegistrationNumber?: string;
  gstInformation?: string;
  
  brandingAssets: {
    logoUrl?: string;
    primaryColor?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(OrganizationType), required: true },
    
    parentOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    
    headquartersAddress: { type: String },
    
    businessRegistrationNumber: { type: String },
    gstInformation: { type: String },
    
    brandingAssets: {
      logoUrl: { type: String },
      primaryColor: { type: String, default: '#000000' }
    }
  },
  {
    timestamps: true,
  }
);

// Prevent cross-tenant parent assignments
organizationSchema.index({ tenantId: 1, name: 1 }, { unique: true });

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
