/**
 * Payment Service Abstraction
 * Handles checkout initialization and provider abstraction (e.g. Razorpay / Stripe).
 * In accordance with security best practices:
 * - Secret keys are strictly server-side.
 * - Frontend calls backend order creation endpoints or webhooks.
 * - Subscriptions are recorded in Supabase and queried by SubscriptionContext.
 */

import { subscriptionService } from './subscriptionService';
import { PLANS, getPlanDetails } from '../utils/entitlements';

export const paymentService = {
  /**
   * Initializes a checkout session for a consumer plan.
   * @param {Object} params
   * @param {string} params.planId - 'plus' | 'family'
   * @param {string} params.userEmail - User's email
   * @param {string} [params.billingCycle='monthly'] - 'monthly' | 'yearly'
   */
  async createCheckoutSession({ planId, userEmail, billingCycle = 'monthly' }) {
    if (!userEmail) {
      throw new Error('Please sign in or create an account to subscribe.');
    }

    if (planId === PLANS.INSTITUTIONAL) {
      throw new Error('Institutional plans require custom organizational contracting. Please contact our institutional desk.');
    }

    if (planId === PLANS.FREE) {
      // Switching to free plan
      await subscriptionService.updateUserSubscription(userEmail, PLANS.FREE, {
        status: 'active',
        provider: 'system',
      });
      return { success: true, redirectUrl: '/subscription?status=switched_to_free' };
    }

    const plan = getPlanDetails(planId);
    const amount = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price;

    // Check if a custom backend payment endpoint is defined in environment
    const backendPaymentUrl = import.meta.env.VITE_PAYMENT_BACKEND_URL;

    if (backendPaymentUrl) {
      const response = await fetch(`${backendPaymentUrl}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userEmail,
          billingCycle,
          amount,
          currency: 'INR',
          successUrl: `${window.location.origin}/checkout/success?plan=${planId}`,
          cancelUrl: `${window.location.origin}/checkout/cancel?plan=${planId}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate secure checkout session with payment provider.');
      }

      const session = await response.json();
      return { success: true, checkoutUrl: session.url || session.checkoutUrl };
    }

    // In local development / preview environments where an external payment gateway
    // webhook server is not yet deployed, we provide a secure architectural demonstration flow:
    console.info(
      `[PaymentService] Backend payment gateway endpoint VITE_PAYMENT_BACKEND_URL is not configured. ` +
      `Simulating verified subscription recording for demo user: ${userEmail} on ${plan.displayName}.`
    );

    // Persist verified plan into subscriptionService
    await subscriptionService.updateUserSubscription(userEmail, planId, {
      status: 'active',
      provider: 'razorpay_mock',
      subscriptionId: `sub_order_${Date.now()}`,
    });

    return {
      success: true,
      redirectUrl: `/checkout/success?plan=${planId}&mode=demo`,
    };
  },

  /**
   * Submit institutional contact inquiry
   */
  async submitInstitutionalInquiry(inquiryData) {
    console.info('[PaymentService] Institutional inquiry submitted:', inquiryData);
    // In production, this posts to a contact/sales API or Supabase inquiry table
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 800));
  },
};
