import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { Mail } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
    }, 1000);
  };
  
  return (
    <section className="py-16 bg-orange-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Mail className="h-12 w-12 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-white text-opacity-90 mb-6">
              Stay updated with our latest products, promotions, and African snack recipes.
            </p>
          </motion.div>
          
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You for Subscribing!</h3>
              <p className="text-gray-600">
                You've been added to our newsletter list. We'll keep you updated with the latest news and offers.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={isLoading}
                className="whitespace-nowrap"
              >
                Subscribe Now
              </Button>
            </motion.form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;