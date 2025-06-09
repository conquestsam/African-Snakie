import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { redirectToCheckout } from '../../lib/stripe';
import { useAuthStore } from '../../store';
import type { StripeProduct } from '../../stripe-config';

interface ProductCardProps {
  product: StripeProduct;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to make a purchase');
      return;
    }

    setIsLoading(true);
    try {
      await redirectToCheckout(product);
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 text-green-600 mr-1" />
            <span className="text-2xl font-bold text-green-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.mode === 'subscription' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {product.mode === 'subscription' ? 'Subscription' : 'One-time'}
            </span>
          </div>
          
          <Button
            onClick={handlePurchase}
            isLoading={isLoading}
            disabled={isLoading}
            leftIcon={<CreditCard className="h-4 w-4" />}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Processing...' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;