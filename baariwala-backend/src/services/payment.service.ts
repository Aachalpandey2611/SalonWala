import { PaymentOrder, PaymentOrderStatus } from '../models/PaymentOrder';
import { Payment, PaymentStatus } from '../models/Payment';
import { PaymentWebhook } from '../models/PaymentWebhook';
import { PaymentGatewayLog } from '../models/PaymentGatewayLog';
import { Appointment } from '../models/Appointment';
import { IPaymentProvider } from './payment-providers/IPaymentProvider';
import { RazorpayProvider } from './payment-providers/RazorpayProvider';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export class PaymentService {
  private static provider: IPaymentProvider = new RazorpayProvider();

  /**
   * 1. Create a Payment Order
   */
  static async createOrder(bookingId: string, customerId: string) {
    const booking = await Appointment.findById(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.customerId.toString() !== customerId) throw new AppError('Unauthorized', 403);
    
    // Check for existing pending orders
    const existingOrder = await PaymentOrder.findOne({ bookingId, status: PaymentOrderStatus.PENDING });
    if (existingOrder) {
      return existingOrder; // Prevent duplicates, return the active intent
    }

    // Usually derived from Service Catalog, hardcoded here based on booking data
    // Assuming bookedPrice is stored in INR decimals
    const amountInPaise = Math.round((booking as any).bookedPrice * 100) || 50000; 

    // Create DB Order
    const dbOrder = await PaymentOrder.create({
      provider: 'RAZORPAY',
      bookingId: booking._id,
      customerId: booking.customerId,
      salonId: booking.salonId,
      currency: 'INR',
      amount: amountInPaise,
      expiresAt: new Date(Date.now() + 15 * 60000), // 15 mins expiry
    });

    try {
      const start = Date.now();
      
      const gatewayResponse = await this.provider.createOrder({
        internalOrderId: dbOrder._id.toString(),
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${dbOrder._id}`,
      });
      
      const latency = Date.now() - start;

      // Update DB Order
      dbOrder.gatewayOrderId = gatewayResponse.gatewayOrderId;
      await dbOrder.save();

      // Log Interaction
      await this.logGatewayInteraction('RAZORPAY', 'createOrder', gatewayResponse, 200, latency);
      
      // Emit Event
      await EventBusService.publish('PaymentCreated', {
        paymentOrderId: dbOrder._id,
        bookingId: booking._id,
        customerId,
        amount: amountInPaise,
      }, 'PaymentGateway');

      return dbOrder;
      
    } catch (error: any) {
      dbOrder.status = PaymentOrderStatus.FAILED;
      await dbOrder.save();
      await this.logGatewayInteraction('RAZORPAY', 'createOrder', error, 500, 0, error.message);
      throw new AppError('Failed to initialize payment with gateway', 502);
    }
  }

  /**
   * 2. Verify Client-Side Payment Signature
   */
  static async verifyPayment(orderId: string, paymentId: string, signature: string) {
    const order = await PaymentOrder.findOne({ gatewayOrderId: orderId });
    if (!order) throw new AppError('Order not found', 404);
    
    const isValid = this.provider.verifySignature(orderId, paymentId, signature);
    
    if (!isValid) {
      logger.error(`[PaymentService] Invalid signature for order ${orderId}`);
      throw new AppError('Invalid Payment Signature', 400);
    }
    
    // Check if Payment already captured
    const existingPayment = await Payment.findOne({ gatewayPaymentId: paymentId });
    if (existingPayment) return existingPayment;
    
    order.status = PaymentOrderStatus.CAPTURED;
    await order.save();
    
    const payment = await Payment.create({
      gatewayPaymentId: paymentId,
      paymentOrderId: order._id,
      bookingId: order.bookingId,
      customerId: order.customerId,
      provider: 'RAZORPAY',
      currency: order.currency,
      amount: order.amount,
      status: PaymentStatus.CAPTURED,
      capturedAt: new Date(),
    });
    
    await EventBusService.publish('PaymentSuccess', {
      paymentId: payment._id,
      bookingId: payment.bookingId,
    }, 'PaymentGateway');
    
    return payment;
  }

  /**
   * 3. Handle Webhooks (Server-to-Server)
   */
  static async handleWebhook(provider: string, payloadStr: string, signature: string, headers: any) {
    if (provider.toUpperCase() !== 'RAZORPAY') throw new AppError('Unsupported provider webhook', 400);
    
    const isValid = this.provider.verifyWebhookSignature({ payload: payloadStr, signature });
    if (!isValid) throw new AppError('Invalid Webhook Signature', 400);
    
    const payload = JSON.parse(payloadStr);
    const eventType = payload.event;
    
    // Extract ID (Using Razorpay specific structure)
    // To keep it clean, we'll hash the payload or use header IDs
    const webhookEventId = headers['x-razorpay-event-id'] || Date.now().toString();
    
    // Idempotency Check
    const existingWebhook = await PaymentWebhook.findOne({ webhookEventId });
    if (existingWebhook) {
      logger.info(`[PaymentService] Duplicate webhook ignored: ${webhookEventId}`);
      return;
    }
    
    await PaymentWebhook.create({
      provider: 'RAZORPAY',
      webhookEventId,
      eventType,
      payloadSnapshot: payloadStr
    });
    
    // Process Event
    if (eventType === 'payment.captured') {
       const paymentEntity = payload.payload.payment.entity;
       const orderId = paymentEntity.order_id;
       const paymentId = paymentEntity.id;
       
       const order = await PaymentOrder.findOne({ gatewayOrderId: orderId });
       if (!order) return; // Order not generated by this system?
       
       if (order.status !== PaymentOrderStatus.CAPTURED) {
           order.status = PaymentOrderStatus.CAPTURED;
           await order.save();
           
           await Payment.create({
              gatewayPaymentId: paymentId,
              paymentOrderId: order._id,
              bookingId: order.bookingId,
              customerId: order.customerId,
              provider: 'RAZORPAY',
              currency: order.currency,
              amount: order.amount,
              status: PaymentStatus.CAPTURED,
              capturedAt: new Date(),
           });
           
           await EventBusService.publish('PaymentCaptured', {
             orderId: order._id,
             paymentId,
             bookingId: order.bookingId,
           }, 'PaymentGateway');
       }
    }
  }

  private static async logGatewayInteraction(provider: string, endpoint: string, payload: any, statusCode: number, latencyMs: number, errorReason?: string) {
    await PaymentGatewayLog.create({
      provider,
      endpoint,
      method: 'API',
      responsePayload: JSON.stringify(payload),
      statusCode,
      latencyMs,
      errorReason
    });
  }
}
