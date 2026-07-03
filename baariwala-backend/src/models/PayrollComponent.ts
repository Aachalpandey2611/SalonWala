import mongoose, { Document, Schema } from 'mongoose';

export enum ComponentType {
  EARNING = 'EARNING',
  DEDUCTION = 'DEDUCTION'
}

export interface IPayrollComponent extends Document {
  salonId: mongoose.Types.ObjectId;
  
  name: string; // e.g., "Basic Salary", "HRA", "Tax Placeholder"
  type: ComponentType;
  
  isTaxable: boolean;
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const payrollComponentSchema = new Schema<IPayrollComponent>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(ComponentType), required: true },
    
    isTaxable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Ensure a salon doesn't have duplicate component names
payrollComponentSchema.index({ salonId: 1, name: 1 }, { unique: true });

export const PayrollComponent = mongoose.model<IPayrollComponent>('PayrollComponent', payrollComponentSchema);
