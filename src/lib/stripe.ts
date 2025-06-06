import { loadStripe } from '@stripe/stripe-js';
import type { PaymentIntent } from '@stripe/stripe-js';
import { supabase } from './supabase';

const STRIPE_SECRET_KEY = 'sk_test_51•••••aHz';
const STRIPE_PUBLIC_KEY = 'pk_test_51•••••aHz';

let stripePromise: Promise<any>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number): Promise<PaymentIntent> => {
  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
      body: new URLSearchParams({
        amount: (amount * 100).toString(), // Convert to cents
        currency: 'usd',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const paymentIntent = await response.json();
    
    // Store payment intent in Supabase
    const { error } = await supabase
      .from('payment_intents')
      .insert({
        stripe_payment_intent_id: paymentIntent.id,
        amount: amount * 100,
        status: paymentIntent.status,
      });

    if (error) {
      console.error('Error storing payment intent:', error);
    }

    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const confirmPayment = async (
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
      body: new URLSearchParams({
        payment_method: paymentMethodId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm payment');
    }

    const paymentIntent = await response.json();

    // Update payment intent status in Supabase
    const { error } = await supabase
      .from('payment_intents')
      .update({ status: paymentIntent.status })
      .eq('stripe_payment_intent_id', paymentIntentId);

    if (error) {
      console.error('Error updating payment intent status:', error);
    }

    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};