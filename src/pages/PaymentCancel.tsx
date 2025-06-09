import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ShoppingCart, RefreshCw, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const PaymentCancel: React.FC = () => {
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
            <p className="text-gray-600 mb-8 text-lg">
              Your payment was cancelled or failed to process. Don't worry, no charges were made to your account.
            </p>
          </motion.div>
          
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What you can do next:</h2>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Try Again</h3>
                  <p className="text-gray-600 mt-1">
                    Go back to your cart and try the checkout process again. Make sure your payment information is correct.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Check Payment Method</h3>
                  <p className="text-gray-600 mt-1">
                    Ensure your card has sufficient funds and that all payment details are entered correctly.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contact Support</h3>
                  <p className="text-gray-600 mt-1">
                    If you continue to experience issues, our customer support team is here to help.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="font-semibold text-yellow-800 mb-2">Common Payment Issues</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details or expired card</li>
              <li>• Bank security restrictions on online purchases</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cart">
              <Button variant="primary" leftIcon={<RefreshCw className="h-4 w-4" />}>
                Try Again
              </Button>
            </Link>
            
            <Link to="/shop">
              <Button variant="outline" leftIcon={<ShoppingCart className="h-4 w-4" />}>
                Continue Shopping
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button variant="outline">
                Contact Support
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

export default PaymentCancel;