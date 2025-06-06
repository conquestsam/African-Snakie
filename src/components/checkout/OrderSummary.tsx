import React from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../types';

interface OrderSummaryProps {
  items: CartItem[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    
    items.forEach((item) => {
      if (!item?.product) return;
      
      const itemPrice = item.product.price;
      const itemDiscountPercentage = item.product.discount_percentage || 0;
      const itemDiscountAmount = itemPrice * (itemDiscountPercentage / 100);
      
      subtotal += itemPrice * item.quantity;
      discount += itemDiscountAmount * item.quantity;
    });
    
    const total = subtotal - discount;
    const shipping = total > 0 ? 10 : 0;
    
    return { subtotal, discount, shipping, total: total + shipping };
  };
  
  const { subtotal, discount, shipping, total } = calculateTotals();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="max-h-[400px] overflow-y-auto mb-4">
        {items.map((item) => {
          // Skip rendering if product is missing
          if (!item?.product) return null;
          
          return (
            <div key={item.id} className="flex py-3 border-b border-gray-200 last:border-b-0">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3 className="line-clamp-1">
                      <Link to={`/product/${item.product.id}`} className="hover:text-orange-600">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="ml-4">₦{(item.product.price * (1 - (item.product.discount_percentage || 0) / 100)).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">Qty {item.quantity}</p>
                  {item.product.discount_percentage && (
                    <p className="text-red-600">-{item.product.discount_percentage}% off</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({items.reduce((acc, item) => acc + (item?.quantity || 0), 0)} items)</span>
          <span>₦{subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-red-600">-₦{discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>₦{shipping.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between pt-2 text-base font-semibold text-gray-900 border-t border-gray-200">
          <span>Total</span>
          <span>₦{total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          to="/cart"
          className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
        >
          ← Back to cart
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;