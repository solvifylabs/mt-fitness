export interface Subscription {
  id: string;
  gatewaySubscriptionId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'expired';
  currentPeriodEnd: Date;
}

export interface Charge {
  id: string;
  gatewayPaymentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
}

export type WebhookEventType =
  | 'subscription.activated'
  | 'subscription.cancelled'
  | 'subscription.expired'
  | 'payment.completed'
  | 'payment.failed';

export interface WebhookEvent {
  type: WebhookEventType;
  userId?: string;
  courseId?: string;
  subscriptionId?: string;
  paymentId?: string;
}

export interface IPaymentGateway {
  createSubscription(userId: string, planId: string): Promise<Subscription>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  createOneTimeCharge(userId: string, courseId: string, amount: number): Promise<Charge>;
  handleWebhook(payload: unknown, signature: string): Promise<WebhookEvent>;
}
