import { Router } from 'express';
import { 
  createOrderController, 
  verifyPaymentController, 
  getPaymentStatusController, 
  razorpayWebhookController 
} from '../controllers/payment.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { paymentSchemas } from '../validators/payment.validator';

const router = Router();

// Webhook endpoint must be publicly accessible (but secured via signature)
router.post('/webhook/razorpay', razorpayWebhookController);

router.use(requireAuth);

router.post('/order', validate(paymentSchemas.createOrder), createOrderController);
router.post('/verify', validate(paymentSchemas.verifyPayment), verifyPaymentController);
router.get('/:id', getPaymentStatusController);

export default router;
