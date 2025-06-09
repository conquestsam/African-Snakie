import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { useCartStore } from '../../store';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateItem, removeItem, isLoading } = useCartStore();
  
  if (!item?.product) {
    return null;
  }
  
  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove();
      return;
    }
    
    if (newQuantity > (item.product?.inventory_count || 0)) {
      toast.error(`Sorry, only ${item.product.inventory_count} items available in stock.`);
      return;
    }
    
    try {
      await updateItem(item.id, newQuantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };
  
  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) return;
    
    try {
      await removeItem(item.id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };
  
  const price = item.product.price || 0;
  const discountPercentage = item.product.discount_percentage || 0;
  const discountedPrice = price * (1 - discountPercentage / 100);
  const subtotal = discountedPrice * item.quantity;
  
  return (
    <div className="flex items-center py-6 border-b border-gray-200">
      <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.product.image_url}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              <Link to={`/product/${item.product.id}`} className="hover:text-green-600">
                {item.product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
          </div>
          <p className="text-lg font-medium text-gray-900">${subtotal.toFixed(2)}</p>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isLoading || item.quantity <= 1}
              className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isLoading || item.quantity >= (item.product?.inventory_count || 0)}
              className="p-2 text-gray-600 hover:text-green-600 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center">
            {discountPercentage > 0 && (
              <div className="flex flex-col items-end mr-4">
                <span className="text-sm text-red-600">-{discountPercentage}%</span>
                <span className="text-sm text-gray-500 line-through">${price.toFixed(2)}</span>
              </div>
            )}
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">${discountedPrice.toFixed(2)}</p>
            </div>
            
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="ml-4 text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;