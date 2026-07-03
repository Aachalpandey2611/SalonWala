import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider, PaymentOrderRequest, PaymentOrderResponse, WebhookValidationRequest } from './IPaymentProvider';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class RazorpayProvider implements IPaymentProvider {
  private instance: any;

  constructor() {
    if (env.razorpay.keyId && env.razorpay.keySecret) {
      this.instance = new Razorpay({
        key_id: env.razorpay.keyId,
        key_secret: env.razorpay.keySecret,
      });
      logger.info('[RazorpayProvider] Razorpay Initialized');
    } else {
      logger.warn('[RazorpayProvider] Missing Razorpay Credentials. Provider will crash on use.');
    }
  }

  async createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse> {
    if (!this.instance) throw new Error('Razorpay is not configured');
    
    const options = {
      amount: request.amount, // smallest unit
      currency: request.currency,
      receipt: request.internalOrderId, // linking our order
    };

    const order = await this.instance.orders.create(options);
    
    return {
      gatewayOrderId: order.id,
      status: order.status,
      rawResponse: order,
    };
  }

  verifySignature(orderId: string, paymentId: string, signature: string): boolean {
    if (!env.razorpay.keySecret) return false;

    const generatedSignature = crypto
      .createHmac('sha256', env.razorpay.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  }

  verifyWebhookSignature(request: WebhookValidationRequest): boolean {
    if (!env.razorpay.webhookSecret) {
      logger.error('[RazorpayProvider] Webhook secret not configured');
      return false;
    }

    const generatedSignature = crypto
      .createHmac('sha256', env.razorpay.webhookSecret)
      .update(request.payload)
      .digest('hex');

    return generatedSignature === request.signature;
  }

  async fetchPayment(paymentId: string): Promise<any> {
    if (!this.instance) throw new Error('Razorpay is not configured');
    return await this.instance.payments.fetch(paymentId);
  }
}
