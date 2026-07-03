import mongoose, { Document, Schema } from 'mongoose';
import { PayrollCycleStatus } from './PayrollCycle';

export enum PayrollType {
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  DAILY_WAGE = 'DAILY_WAGE',
  HOURLY = 'HOURLY',
  CONTRACT = 'CONTRACT',
  COMMISSION_ONLY = 'COMMISSION_ONLY',
  HYBRID_SALARY = 'HYBRID_SALARY'
}

export interface IPayrollComponentEntry {
  componentId: mongoose.Types.ObjectId;
  amount: number;
}

export interface IPayroll extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  cycleId: mongoose.Types.ObjectId;
  
  payrollType: PayrollType;
  
  // Salary details
  components: IPayrollComponentEntry[]; // Earnings & Deductions
  
  grossSalary: number; // Base + Fixed Earnings
  totalDeductions: number; // Configured deductions
  totalCommission: number; // Aggregated from Commission Engine
  
  netSalary: number; // (grossSalary + totalCommission) - totalDeductions
  
  status: PayrollCycleStatus; // Can override cycle status (e.g. if one employee's payroll is on hold)
  
  createdAt: Date;
  updatedAt: Date;
}

const payrollComponentEntrySchema = new Schema<IPayrollComponentEntry>({
  componentId: { type: Schema.Types.ObjectId, ref: 'PayrollComponent', required: true },
  amount: { type: Number, required: true }
}, { _id: false });

const payrollSchema = new Schema<IPayroll>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    cycleId: { type: Schema.Types.ObjectId, ref: 'PayrollCycle', required: true, index: true },
    
    payrollType: { type: String, enum: Object.values(PayrollType), required: true },
    
    components: [payrollComponentEntrySchema],
    
    grossSalary: { type: Number, required: true, default: 0 },
    totalDeductions: { type: Number, required: true, default: 0 },
    totalCommission: { type: Number, required: true, default: 0 },
    
    netSalary: { type: Number, required: true, default: 0 },
    
    status: { type: String, enum: Object.values(PayrollCycleStatus), default: PayrollCycleStatus.DRAFT, index: true },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate payrolls for the same employee in the same cycle
payrollSchema.index({ cycleId: 1, employeeId: 1 }, { unique: true });

export const Payroll = mongoose.model<IPayroll>('Payroll', payrollSchema);
