import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/8969237/pexels-photo-8969237.jpeg"
          alt="African Snacks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Discover Authentic African Snacks
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xl text-gray-200 mb-8">
              Experience the rich flavors and traditions of Africa delivered right to your doorstep. Our handpicked selection of snacks brings you the authentic taste of the continent.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/shop">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Shop Now
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-gray-900">
                Explore Categories
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;