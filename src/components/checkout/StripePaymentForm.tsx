import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw error;
      }

      toast.success('Payment successful!');
      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
      </Button>
    </form>
  );
};

interface StripePaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  orderId,
  onSuccess,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Validate environment variables
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase configuration is missing');
        }

        const functionUrl = `${supabaseUrl}/functions/v1/create-payment-intent`;
        
        console.log('Creating payment intent for amount:', amount, 'orderId:', orderId);

        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            amount: amount,
            orderId: orderId,
            currency: 'usd',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment intent creation failed:', response.status, errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        if (!data.clientSecret) {
          throw new Error('No client secret received from payment intent');
        }

        console.log('Payment intent created successfully');
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        setError(error.message || 'Failed to initialize payment');
        toast.error('Failed to initialize payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, orderId]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Unable to initialize payment</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Details</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-xl font-bold text-orange-600">${amount.toFixed(2)}</span>
        </div>
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#ea580c',
              colorBackground: '#ffffff',
              colorText: '#1f2937',
              colorDanger: '#ef4444',
              fontFamily: 'system-ui, sans-serif',
              spacingUnit: '4px',
              borderRadius: '8px',
            },
          },
        }}
      >
        <PaymentForm clientSecret={clientSecret} onSuccess={onSuccess} />
      </Elements>

      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-4 mb-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
            alt="Mastercard"
            className="h-6"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
            alt="American Express"
            className="h-6"
          />
        </div>
        <p className="text-xs text-gray-500">
          Powered by Stripe - Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default StripePaymentForm;