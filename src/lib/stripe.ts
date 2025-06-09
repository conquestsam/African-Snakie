import { supabase } from './supabase';
import type { StripeProduct } from '../stripe-config';

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(
  amount: number,
  mode: 'payment' | 'subscription' = 'payment',
  metadata: Record<string, string> = {}
): Promise<CheckoutSessionResponse> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('User must be authenticated to create checkout session');
  }

  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/payment-success`;
  const cancelUrl = `${baseUrl}/payment-cancel`;

  console.log('Creating checkout session with:', {
    amount: amount,
    mode,
    metadata,
    successUrl,
    cancelUrl
  });

  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      amount: amount, // Ensure this is a number
      success_url: successUrl,
      cancel_url: cancelUrl,
      mode,
      metadata,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Checkout session creation failed:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    
    let errorMessage = 'Failed to create checkout session';
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If we can't parse the error, use the raw text
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function redirectToCheckout(product: StripeProduct): Promise<void> {
  try {
    const { url } = await createCheckoutSession(product.price, product.mode, {
      productName: product.name,
      priceId: product.priceId
    });
    window.location.href = url;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

export async function getUserSubscription() {
  const { data, error } = await supabase
    .from('stripe_user_subscriptions')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function getUserOrders() {
  const { data, error } = await supabase
    .from('stripe_user_orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}