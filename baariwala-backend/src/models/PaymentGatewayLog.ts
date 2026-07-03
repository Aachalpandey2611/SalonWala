import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentGatewayLog extends Document {
  provider: string; // 'RAZORPAY'
  
  endpoint: string;
  method: string;
  
  requestPayload: string;
  responsePayload: string;
  
  statusCode: number;
  latencyMs: number;
  
  errorReason?: string;
  
  createdAt: Date;
}

const paymentGatewayLogSchema = new Schema<IPaymentGatewayLog>(
  {
    provider: { type: String, required: true, index: true },
    
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    
    requestPayload: { type: String },
    responsePayload: { type: String },
    
    statusCode: { type: Number, required: true },
    latencyMs: { type: Number, required: true },
    
    errorReason: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PaymentGatewayLog = mongoose.model<IPaymentGatewayLog>('PaymentGatewayLog', paymentGatewayLogSchema);
