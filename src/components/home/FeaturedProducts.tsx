import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '../../store';
import ProductCard from '../ui/ProductCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, isLoading, fetchFeaturedProducts } = useProductStore();
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <TailSpin
          height="60"
          width="60"
          color="#EA580C"
          ariaLabel="loading"
        />
      </div>
    );
  }
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Featured Snacks</h2>
            <p className="text-gray-600 mt-2">Discover our most popular African treats</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link
              to="/shop"
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors font-medium"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </motion.div>
        </div>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No featured products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;