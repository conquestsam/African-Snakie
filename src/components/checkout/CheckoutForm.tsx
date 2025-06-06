import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import { useAuthStore, useCartStore } from '../../store';
import * as supabaseService from '../../lib/supabase';
import StripePaymentForm from './StripePaymentForm';

const CheckoutForm: React.FC = () => {
  const { user } = useAuthStore();
  const { cart, clearCartAfterOrder } = useCartStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    deliveryMethod: 'standard',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const calculateTotals = () => {
    if (!cart?.items) return { subtotal: 0, discount: 0, shipping: 0, total: 0 };
    
    let subtotal = 0;
    let discount = 0;
    
    cart.items.forEach((item) => {
      if (!item?.product) return;
      
      const itemPrice = item.product.price || 0;
      const itemDiscountPercentage = item.product.discount_percentage || 0;
      const itemDiscountAmount = itemPrice * (itemDiscountPercentage / 100);
      
      subtotal += itemPrice * item.quantity;
      discount += itemDiscountAmount * item.quantity;
    });
    
    const total = subtotal - discount;
    const shipping = formData.deliveryMethod === 'express' ? 20 : 10;
    
    return { subtotal, discount, shipping, total: total + shipping };
  };
  
  const { total } = calculateTotals();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !cart) {
      toast.error('You need to be logged in with items in your cart to checkout');
      return;
    }
    
    // Validate that all cart items have valid products
    const hasInvalidItems = cart.items.some(item => !item?.product);
    if (hasInvalidItems) {
      toast.error('Some items in your cart are no longer available. Please review your cart.');
      navigate('/cart');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create shipping address
      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`;
      
      // Create order
      const order = await supabaseService.createOrder(user.id, {
        total_amount: total,
        status: 'pending',
        payment_status: 'pending',
        shipping_address: shippingAddress,
        delivery_method: formData.deliveryMethod,
      }, cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price * (1 - (item.product.discount_percentage || 0) / 100),
      })));

      setOrderId(order.id);
      toast.success('Order created successfully! Please complete payment.');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (orderId && cart) {
        // Update order status to confirmed and payment status to completed
        await supabaseService.updateOrderStatus(orderId, 'confirmed', 'completed');
        
        // Clear the cart
        await clearCartAfterOrder(cart.id);
        
        toast.success('Payment successful! Order confirmed.');
        navigate('/order-confirmation');
      }
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Payment successful but there was an issue completing the order. Please contact support.');
    }
  };
  
  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Delivery Method */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Delivery Method</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="standard"
                name="deliveryMethod"
                type="radio"
                value="standard"
                checked={formData.deliveryMethod === 'standard'}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="standard" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Standard Delivery</span>
                <span className="block text-sm text-gray-500">4-5 business days</span>
                <span className="block text-sm font-medium text-gray-900">$10.00</span>
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="express"
                name="deliveryMethod"
                type="radio"
                value="express"
                checked={formData.deliveryMethod === 'express'}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="express" className="ml-3">
                <span className="block text-sm font-medium text-gray-900">Express Delivery</span>
                <span className="block text-sm text-gray-500">1-2 business days</span>
                <span className="block text-sm font-medium text-gray-900">$20.00</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        {!orderId && (
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
              disabled={!cart?.items?.length || isSubmitting}
            >
              Continue to Payment
            </Button>
            
            <p className="mt-2 text-xs text-gray-500 text-center">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        )}
      </form>

      {orderId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
          <StripePaymentForm
            amount={total}
            orderId={orderId}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;