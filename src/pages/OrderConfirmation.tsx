import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const OrderConfirmation: React.FC = () => {
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
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for your order. We've received your order and will begin processing it right away.
            </p>
          </motion.div>
          
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h2>
            
            <div className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">1</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Order Processing</h3>
                  <p className="text-gray-600 mt-1">
                    We're preparing your order for shipment. You'll receive an email once your order has been shipped.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">2</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Shipping</h3>
                  <p className="text-gray-600 mt-1">
                    Your order will be shipped within 1-2 business days. You can track your order status in your account.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex"
              >
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">3</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Delivery</h3>
                  <p className="text-gray-600 mt-1">
                    Enjoy your authentic Nigerian snacks! Don't forget to leave a review and share your experience.
                  </p>
                </div>
              </motion.div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;