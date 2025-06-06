import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSummary from '../components/checkout/OrderSummary';
import { TailSpin } from 'react-loader-spinner';

const Checkout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { cart, isLoading, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      fetchCart(user.id);
    }
  }, [isAuthenticated, user, fetchCart, navigate]);
  
  useEffect(() => {
    if (cart && (!cart.items || cart.items.length === 0) && !isLoading) {
      navigate('/cart');
    }
  }, [cart, isLoading, navigate]);
  
  if (!isAuthenticated || isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex justify-center items-center">
        <TailSpin
          height="60"
          width="60"
          color="#EA580C"
          ariaLabel="loading"
        />
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }
  
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          
          <div>
            <OrderSummary items={cart.items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;