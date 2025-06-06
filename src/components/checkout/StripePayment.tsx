import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { getStripe, createPaymentIntent } from '../../lib/stripe';

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ amount, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const paymentIntent = await createPaymentIntent(amount);
      
      const { error } = await stripe.confirmPayment({
        elements: {
          payment_method: {
            card: {
              number: '4242424242424242',
              exp_month: 12,
              exp_year: 2024,
              cvc: '123',
            },
          },
        },
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw error;
      }

      onSuccess();
      navigate('/order-confirmation');
      toast.success('Payment successful!');
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handlePayment}
      isLoading={isProcessing}
      fullWidth
    >
      Pay ${amount.toFixed(2)}
    </Button>
  );
};

export default StripePayment;