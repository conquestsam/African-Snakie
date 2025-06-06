import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, CreditCard, PackageCheck } from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-white" />,
    title: 'Browse & Discover',
    description: 'Explore our wide selection of authentic African snacks from different regions.'
  },
  {
    icon: <ShoppingCart className="h-10 w-10 text-white" />,
    title: 'Add to Cart',
    description: 'Select your favorite items and add them to your shopping cart.'
  },
  {
    icon: <CreditCard className="h-10 w-10 text-white" />,
    title: 'Secure Checkout',
    description: 'Complete your purchase with our safe and secure payment options.'
  },
  {
    icon: <PackageCheck className="h-10 w-10 text-white" />,
    title: 'Fast Delivery',
    description: 'Receive your order at your doorstep and enjoy the taste of Africa.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Shopping for your favorite African snacks has never been easier. Follow these simple steps to get started.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-1 bg-orange-600 z-0"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative z-10 text-center"
            >
              <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                {step.icon}
                <div className="absolute -top-2 -right-2 bg-white text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;