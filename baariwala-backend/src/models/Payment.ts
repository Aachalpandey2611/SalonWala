import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  FAILED = 'FAILED',
  REFUND_INITIATED = 'REFUND_INITIATED',
  REFUNDED = 'REFUNDED'
}

export interface IPayment extends Document {
  gatewayPaymentId: string; // The ID from Razorpay for the specific payment
  paymentOrderId: mongoose.Types.ObjectId; // Reference to our internal PaymentOrder
  
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  provider: string; // 'RAZORPAY'
  
  currency: string;
  amount: number; // in smallest currency unit
  
  status: PaymentStatus;
  
  paymentMethod?: string; // 'card', 'upi', 'netbanking'
  
  errorDescription?: string;
  
  capturedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    gatewayPaymentId: { type: String, required: true, unique: true, index: true },
    paymentOrderId: { type: Schema.Types.ObjectId, ref: 'PaymentOrder', required: true, index: true },
    
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    provider: { type: String, required: true },
    
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
    
    status: { type: String, enum: Object.values(PaymentStatus), required: true, index: true },
    
    paymentMethod: { type: String },
    
    errorDescription: { type: String },
    
    capturedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
