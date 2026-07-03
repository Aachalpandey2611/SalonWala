export interface PaymentOrderRequest {
  internalOrderId: string;
  amount: number;
  currency: string;
  receipt?: string;
}

export interface PaymentOrderResponse {
  gatewayOrderId: string;
  status: string;
  rawResponse: any;
}

export interface WebhookValidationRequest {
  payload: string; // raw body
  signature: string;
}

export interface IPaymentProvider {
  /**
   * Initialize a new order with the payment gateway
   */
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse>;
  
  /**
   * Verify a signature from client-side complete
   */
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
  
  /**
   * Securely validate an incoming webhook signature
   */
  verifyWebhookSignature(request: WebhookValidationRequest): boolean;
  
  /**
   * Fetch payment details from the gateway directly
   */
  fetchPayment(paymentId: string): Promise<any>;
}
