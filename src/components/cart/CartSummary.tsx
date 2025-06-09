import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import type { CartItem } from '../../types';
import { toast } from 'react-hot-toast';

interface CartSummaryProps {
  items: CartItem[];
}

const CartSummary: React.FC<CartSummaryProps> = ({ items }) => {
  const navigate = useNavigate();
  
  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    
    items.forEach((item) => {
      if (!item?.product) return;
      
      const itemPrice = item.product.price || 0;
      const itemDiscountPercentage = item.product.discount_percentage || 0;
      const itemDiscountAmount = itemPrice * (itemDiscountPercentage / 100);
      
      subtotal += itemPrice * item.quantity;
      discount += itemDiscountAmount * item.quantity;
    });
    
    const total = subtotal - discount;
    const shipping = total > 0 ? 10 : 0;
    
    return { subtotal, discount, shipping, total: total + shipping };
  };
  
  const { subtotal, discount, shipping, total } = calculateTotals();
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    // Check if all items have valid products
    const hasInvalidItems = items.some(item => !item?.product);
    if (hasInvalidItems) {
      toast.error('Some items in your cart are invalid. Please refresh the page.');
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.reduce((acc, item) => acc + (item?.quantity || 0), 0)} items)</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-red-600">-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">${shipping.toFixed(2)}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-semibold text-gray-900">${total.toFixed(2)} USD</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Button
          variant="primary"
          fullWidth
          onClick={handleCheckout}
          disabled={items.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          Proceed to Checkout (${total.toFixed(2)})
        </Button>
        
        <div className="mt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/shop')}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-2 mb-2">
          <img
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
            alt="PayPal"
            className="h-6"
          />
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-visa-3-226460.png"
            alt="Visa"
            className="h-6"
          />
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/free-mastercard-3-226462.png"
            alt="Mastercard"
            className="h-6"
          />
        </div>
        <p className="text-xs text-gray-500">
          Secure checkout powered by Stripe
        </p>
      </div>
    </div>
  );
};

export default CartSummary;