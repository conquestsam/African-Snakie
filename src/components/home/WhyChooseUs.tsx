import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, ThumbsUp, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: <Package className="h-10 w-10 text-orange-600" />,
    title: 'Authentic Products',
    description: 'We source our snacks directly from local African producers, ensuring authentic flavors and supporting local communities.'
  },
  {
    icon: <Truck className="h-10 w-10 text-orange-600" />,
    title: 'Fast Delivery',
    description: 'Get your favorite African snacks delivered to your doorstep quickly with our efficient logistics network.'
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-orange-600" />,
    title: 'Quality Guaranteed',
    description: 'All our products undergo strict quality checks to ensure freshness and the highest standards.'
  },
  {
    icon: <ThumbsUp className="h-10 w-10 text-orange-600" />,
    title: 'Customer Satisfaction',
    description: 'Our dedicated support team is always ready to assist you with any questions or concerns.'
  }
];

const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Snakie?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to bringing you the best African snack experience with quality, authenticity, and exceptional service.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;