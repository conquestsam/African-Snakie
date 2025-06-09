import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuthStore, useCartStore } from '../store';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/ui/Button';
import { TailSpin } from 'react-loader-spinner';

const Cart: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { cart, isLoading, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchCart(user.id);
    }
  }, [isAuthenticated, user, fetchCart]);
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-md">
            <ShoppingBag className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-6">Please log in to view your cart and continue shopping.</p>
            <Button variant="primary" onClick={handleLogin}>
              Log In
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
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
  
  const hasItems = cart?.items && cart.items.length > 0;
  
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>
        
        {!hasItems ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any African snacks to your cart yet.
            </p>
            <Button variant="primary" onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Cart Items ({cart.items.reduce((total, item) => total + item.quantity, 0)})
                </h2>
                
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <CartSummary items={cart.items} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;