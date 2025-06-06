import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore, useAuthStore } from '../../store';
import Button from './Button';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductModal from './ProductModal';

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showQuickView = true, 
  viewMode = 'grid' 
}) => {
  const { addItem, isLoading, error } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }
    
    try {
      await addItem(product.id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(error || 'Failed to add item to cart');
    }
  };
  
  const renderDiscountBadge = () => {
    if (!product.discount_percentage) return null;
    
    return (
      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 z-10">
        {product.discount_percentage}% OFF
      </div>
    );
  };
  
  const calculateDiscountedPrice = () => {
    if (!product.discount_percentage) return product.price;
    return product.price * (1 - product.discount_percentage / 100);
  };

  const renderStars = (rating: number = 4.5) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (viewMode === 'list') {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-48 h-48 sm:h-32 flex-shrink-0">
              {renderDiscountBadge()}
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  {renderStars()}
                  <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-green-600">
                    ${calculateDiscountedPrice().toFixed(2)}
                  </span>
                  {product.discount_percentage && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="primary"
                  size="sm"
                  leftIcon={<ShoppingCart className="h-4 w-4" />}
                  onClick={handleAddToCart}
                  isLoading={isLoading}
                  disabled={product.inventory_count === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {product.inventory_count === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                {showQuickView && (
                  <Button 
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="h-4 w-4" />}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <ProductModal
          product={product}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  // Grid view (default)
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative">
          {renderDiscountBadge()}
          
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {renderStars()}
              <span className="text-xs text-gray-500 ml-1">(4.5)</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-600">
                  ${calculateDiscountedPrice().toFixed(2)}
                </span>
                {product.discount_percentage && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              
              {product.inventory_count <= 5 && product.inventory_count > 0 && (
                <span className="text-xs text-orange-600 font-medium">
                  Only {product.inventory_count} left!
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="primary"
                size="sm"
                fullWidth
                leftIcon={<ShoppingCart className="h-4 w-4" />}
                onClick={handleAddToCart}
                isLoading={isLoading}
                disabled={product.inventory_count === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {product.inventory_count === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              {showQuickView && (
                <Button 
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="h-4 w-4" />}
                  className="flex-shrink-0 border-green-600 text-green-600 hover:bg-green-50"
                  onClick={() => setIsModalOpen(true)}
                >
                  View
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;