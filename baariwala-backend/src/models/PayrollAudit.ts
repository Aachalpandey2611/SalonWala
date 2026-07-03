import mongoose, { Document, Schema } from 'mongoose';

export enum PayrollAuditAction {
  GENERATED = 'GENERATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  MANUAL_ADJUSTMENT = 'MANUAL_ADJUSTMENT',
  PAID = 'PAID',
  PAYSLIP_GENERATED = 'PAYSLIP_GENERATED'
}

export interface IPayrollAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  action: PayrollAuditAction;
  
  performedBy: mongoose.Types.ObjectId; // User ID or System
  targetId?: mongoose.Types.ObjectId; // e.g. Payroll ID or Cycle ID
  
  details: any; // JSON payload of changes or snapshots
  
  createdAt: Date;
}

const payrollAuditSchema = new Schema<IPayrollAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    action: { type: String, enum: Object.values(PayrollAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId },
    
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PayrollAudit = mongoose.model<IPayrollAudit>('PayrollAudit', payrollAuditSchema);
