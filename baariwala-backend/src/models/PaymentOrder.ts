import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentOrderStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface IPaymentOrder extends Document {
  gatewayOrderId?: string; // ID returned from Razorpay, Stripe, etc.
  provider: string; // 'RAZORPAY', 'STRIPE', etc.
  
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  currency: string;
  amount: number; // in smallest currency unit (e.g., paise, cents)
  
  status: PaymentOrderStatus;
  
  receipt?: string;
  
  expiresAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const paymentOrderSchema = new Schema<IPaymentOrder>(
  {
    gatewayOrderId: { type: String, unique: true, sparse: true, index: true },
    provider: { type: String, required: true, index: true },
    
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    currency: { type: String, required: true, default: 'INR' },
    amount: { type: Number, required: true },
    
    status: { type: String, enum: Object.values(PaymentOrderStatus), default: PaymentOrderStatus.PENDING, index: true },
    
    receipt: { type: String },
    
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const PaymentOrder = mongoose.model<IPaymentOrder>('PaymentOrder', paymentOrderSchema);
