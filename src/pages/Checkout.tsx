import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useCartStore } from '../store';
import { TailSpin } from 'react-loader-spinner';
import { ShoppingCart, CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import MockPaymentForm from '../components/checkout/MockPaymentForm';

const Checkout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { cart, isLoading, fetchCart } = useCartStore();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    deliveryMethod: 'standard',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user) {
      fetchCart(user.id);
    }
  }, [isAuthenticated, user, fetchCart, navigate]);

  useEffect(() => {
    if (cart && (!cart.items || cart.items.length === 0) && !isLoading) {
      navigate('/cart');
    }
  }, [cart, isLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
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
    const shipping = shippingInfo.deliveryMethod === 'express' ? 20 : 10;
    
    return { subtotal, discount, shipping, total: total + shipping };
  };

  const { subtotal, discount, shipping, total } = calculateTotals();

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate shipping information
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!cart?.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Create a mock order ID
      const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setOrderId(mockOrderId);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (cart) {
        // Clear the cart after successful payment
        await useCartStore.getState().clearCartAfterOrder(cart.id);
        
        // Navigate to success page
        navigate('/payment-success');
      }
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Payment successful but there was an issue completing the order. Please contact support.');
    }
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex justify-center items-center">
        <TailSpin height="60\" width="60\" color="#16a34a\" ariaLabel="loading" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      {item.product.discount_percentage && (
                        <p className="text-sm text-red-600">-{item.product.discount_percentage}% off</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.product.price * (1 - (item.product.discount_percentage || 0) / 100) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping ({shippingInfo.deliveryMethod})</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-green-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information or Payment */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {!showPayment ? (
                <>
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Shipping Information
                  </h2>

                  <form onSubmit={handleProceedToPayment} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <User className="h-4 w-4 inline mr-1" />
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Ghana">Ghana</option>
                          <option value="Kenya">Kenya</option>
                          <option value="South Africa">South Africa</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Delivery Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="standard"
                            checked={shippingInfo.deliveryMethod === 'standard'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <div className="ml-3">
                            <div className="font-medium">Standard Delivery - $10.00</div>
                            <div className="text-sm text-gray-500">4-5 business days</div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value="express"
                            checked={shippingInfo.deliveryMethod === 'express'}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <div className="ml-3">
                            <div className="font-medium">Express Delivery - $20.00</div>
                            <div className="text-sm text-gray-500">1-2 business days</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        size="lg"
                        isLoading={isProcessing}
                        leftIcon={<CreditCard className="h-5 w-5" />}
                        className="bg-green-600 hover:bg-green-700 text-lg py-4"
                      >
                        {isProcessing ? 'Processing...' : `Continue to Payment - $${total.toFixed(2)}`}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <MockPaymentForm
                  amount={total}
                  orderId={orderId!}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;