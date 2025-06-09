import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/stripe/ProductCard';
import SubscriptionStatus from '../components/stripe/SubscriptionStatus';
import OrderHistory from '../components/stripe/OrderHistory';
import { stripeProducts } from '../stripe-config';
import { useAuthStore } from '../store';

const StripeProducts: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            African Snakie Products
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our authentic African snacks and delicacies. Each product is carefully prepared 
            with traditional recipes and the finest ingredients.
          </p>
        </motion.div>

        {isAuthenticated && (
          <div className="mb-12">
            <SubscriptionStatus />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stripeProducts.map((product, index) => (
            <ProductCard key={product.priceId} product={product} index={index} />
          ))}
        </div>

        {isAuthenticated && (
          <div className="mt-12">
            <OrderHistory />
          </div>
        )}

        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center bg-white rounded-lg shadow-md p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to taste authentic African flavors?
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up or log in to start purchasing our delicious African snacks and track your orders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="inline-block border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
              >
                Log In
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StripeProducts;