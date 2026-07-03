import mongoose, { Document, Schema } from 'mongoose';

export enum PayslipStatus {
  GENERATED = 'GENERATED',
  SENT = 'SENT',
  DOWNLOADED = 'DOWNLOADED'
}

export interface IPayslip extends Document {
  payrollId: mongoose.Types.ObjectId;
  
  payslipNumber: string; // Unique string, e.g. PS-MAY26-001
  
  // Snapshot of critical payload (immutable)
  employeeDetails: {
    name: string;
    role: string;
  };
  
  cycleDetails: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  
  totals: {
    grossSalary: number;
    totalDeductions: number;
    totalCommission: number;
    netSalary: number;
  };
  
  status: PayslipStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

const payslipSchema = new Schema<IPayslip>(
  {
    payrollId: { type: Schema.Types.ObjectId, ref: 'Payroll', required: true, unique: true, index: true },
    
    payslipNumber: { type: String, required: true, unique: true },
    
    employeeDetails: {
      name: { type: String, required: true },
      role: { type: String, required: true }
    },
    
    cycleDetails: {
      name: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    },
    
    totals: {
      grossSalary: { type: Number, required: true },
      totalDeductions: { type: Number, required: true },
      totalCommission: { type: Number, required: true },
      netSalary: { type: Number, required: true }
    },
    
    status: { type: String, enum: Object.values(PayslipStatus), default: PayslipStatus.GENERATED },
  },
  {
    timestamps: true,
  }
);

export const Payslip = mongoose.model<IPayslip>('Payslip', payslipSchema);
