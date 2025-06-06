import React from 'react';
import { motion } from 'framer-motion';
import { TailSpin } from 'react-loader-spinner';
import type { Product } from '../../types';
import ProductCard from '../ui/ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading, viewMode = 'grid' }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <TailSpin
          height="60"
          width="60"
          color="#16a34a"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    : "space-y-4";

  return (
    <div className={gridClasses}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={viewMode === 'list' ? 'w-full' : ''}
        >
          <ProductCard product={product} viewMode={viewMode} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;