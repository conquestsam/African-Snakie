import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';
import Button from './Button';
import { useCartStore, useAuthStore } from '../../store';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await addItem(product.id, 1);
      toast.success('Added to cart!');
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const discountedPrice = product.price * (1 - (product.discount_percentage || 0) / 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${discountedPrice.toFixed(2)}
                  </span>
                  {product.discount_percentage && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-red-600">
                        -{product.discount_percentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Category: </span>
                    {product.categories?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Stock: </span>
                    {product.inventory_count} units
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                fullWidth
                disabled={product.inventory_count === 0}
              >
                {product.inventory_count === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;