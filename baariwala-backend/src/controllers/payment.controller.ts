import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { PaymentOrder } from '../models/PaymentOrder';
import { Payment } from '../models/Payment';
import { catchAsync } from '../utils/catchAsync';

export const createOrderController = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const order = await PaymentService.createOrder(bookingId, req.user!.id);
  res.status(201).json({ success: true, data: order });
});

export const verifyPaymentController = catchAsync(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const payment = await PaymentService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  res.status(200).json({ success: true, data: payment, message: 'Payment verified successfully' });
});

export const getPaymentStatusController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await PaymentOrder.findOne({ bookingId: id, customerId: req.user!.id });
  if (!order) return res.status(404).json({ success: false, message: 'Payment Order not found' });
  
  const payment = await Payment.findOne({ paymentOrderId: order._id });
  
  res.status(200).json({ 
    success: true, 
    data: { order, payment }
  });
});

export const razorpayWebhookController = catchAsync(async (req: Request, res: Response) => {
  // Webhooks are typically sent as raw JSON. For simplicity with body-parser,
  // we assume we have access to raw body string via a middleware or req.body.
  // We'll stringify req.body for now (ideally, use express.raw).
  
  const payloadStr = JSON.stringify(req.body);
  const signature = req.headers['x-razorpay-signature'] as string;
  
  await PaymentService.handleWebhook('RAZORPAY', payloadStr, signature, req.headers);
  
  res.status(200).json({ status: 'ok' });
});
