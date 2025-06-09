import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';

interface MockPaymentFormProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const MockPaymentForm: React.FC<MockPaymentFormProps> = ({
  amount,
  orderId,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    // Format CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success (you can add validation logic here)
      const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
      
      // Simple validation
      if (cardNumber.length < 13 || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
        throw new Error('Please fill in all payment details');
      }

      // Simulate different card responses
      if (cardNumber.startsWith('4000000000000002')) {
        throw new Error('Your card was declined. Please try a different payment method.');
      }

      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Lock className="w-4 h-4 mr-1" />
          Secure Payment
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <p className="text-sm font-medium text-blue-900">Demo Payment Mode</p>
            <p className="text-xs text-blue-700">Use card number 4242424242424242 for successful payment</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            id="cardholderName"
            name="cardholderName"
            type="text"
            value={paymentData.cardholderName}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              value={paymentData.cardNumber}
              onChange={handleChange}
              placeholder="4242 4242 4242 4242"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="text"
              value={paymentData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              id="cvv"
              name="cvv"
              type="text"
              value={paymentData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-green-600">${amount.toFixed(2)}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isProcessing}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? 'Processing Payment...' : `Pay $${amount.toFixed(2)}`}
          </Button>
        </div>
      </form>

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
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default MockPaymentForm;