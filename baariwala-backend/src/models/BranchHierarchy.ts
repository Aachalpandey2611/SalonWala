import mongoose, { Document, Schema } from 'mongoose';

export enum HierarchyLevel {
  REGION = 'REGION', // e.g. "West Coast"
  DISTRICT = 'DISTRICT', // e.g. "Los Angeles County"
  BRANCH = 'BRANCH' // e.g. "Hollywood Branch"
}

export interface IBranchHierarchy extends Document {
  tenantId: mongoose.Types.ObjectId; // Strict Tenant Isolation
  organizationId: mongoose.Types.ObjectId;
  
  name: string;
  level: HierarchyLevel;
  
  parentHierarchyId?: mongoose.Types.ObjectId; // For nesting (e.g. Region -> District -> Branch)
  
  // If this hierarchy node is a physical Branch, link to our existing Branch model
  physicalBranchId?: mongoose.Types.ObjectId; 
  
  regionalManagerId?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const branchHierarchySchema = new Schema<IBranchHierarchy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    
    name: { type: String, required: true },
    level: { type: String, enum: Object.values(HierarchyLevel), required: true },
    
    parentHierarchyId: { type: Schema.Types.ObjectId, ref: 'BranchHierarchy', index: true },
    physicalBranchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true }, // Links to the operational Branch model
    
    regionalManagerId: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

// We can use MongoDB $graphLookup on this collection for deep hierarchy queries
branchHierarchySchema.index({ tenantId: 1, organizationId: 1 });

export const BranchHierarchy = mongoose.model<IBranchHierarchy>('BranchHierarchy', branchHierarchySchema);
