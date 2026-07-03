import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentWebhook extends Document {
  provider: string; // 'RAZORPAY'
  
  webhookEventId: string; // Used for Idempotency
  
  eventType: string; // e.g., 'payment.captured'
  
  payloadSnapshot: string;
  
  processedAt: Date;
}

const paymentWebhookSchema = new Schema<IPaymentWebhook>(
  {
    provider: { type: String, required: true },
    
    webhookEventId: { type: String, required: true, unique: true, index: true },
    
    eventType: { type: String, required: true },
    
    payloadSnapshot: { type: String, required: true },
    
    processedAt: { type: Date, required: true, default: Date.now },
  }
);

export const PaymentWebhook = mongoose.model<IPaymentWebhook>('PaymentWebhook', paymentWebhookSchema);
