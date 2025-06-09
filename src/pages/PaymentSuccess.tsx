import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag, Home, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const PaymentSuccess: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Thank you for your purchase! Your payment has been processed successfully.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-green-50 p-6 rounded-lg mb-8"
          >
            <div className="flex items-center mb-4">
              <Package className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-green-800">Order Confirmed</h3>
            </div>
            <p className="text-gray-700 text-sm">
              Your order has been confirmed and will be processed shortly. You'll receive an email confirmation with tracking details.
            </p>
          </motion.div>
          
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                  <p className="text-gray-600 mt-1">
                    You'll receive an email confirmation with your purchase details and receipt.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Processing</h3>
                  <p className="text-gray-600 mt-1">
                    We'll prepare your delicious African snacks and get them ready for delivery.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Fast Delivery</h3>
                  <p className="text-gray-600 mt-1">
                    Your authentic African snacks will be delivered to your doorstep within the estimated timeframe.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-green-800 mb-2">Need Help?</h3>
            <p className="text-green-700 text-sm">
              If you have any questions about your order, please contact our customer support team at{' '}
              <a href="mailto:support@africansnakie.com" className="underline">
                support@africansnakie.com
              </a>{' '}
              or call us at +1 555 (123-4567).
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/orders">
              <Button variant="primary" leftIcon={<Package className="h-4 w-4" />}>
                View My Orders
              </Button>
            </Link>
            
            <Link to="/shop">
              <Button variant="outline" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                Continue Shopping
              </Button>
            </Link>
            
            <Link to="/">
              <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;