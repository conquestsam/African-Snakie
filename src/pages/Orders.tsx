import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { TailSpin } from 'react-loader-spinner';
import { Package, Calendar, DollarSign, Truck } from 'lucide-react';
import * as supabaseService from '../lib/supabase';
import type { Order } from '../types';

const Orders: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await supabaseService.getOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user?.id]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h1>
            <p className="text-gray-600">You need to be logged in to view your orders.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex justify-center items-center">
        <TailSpin
          height="60"
          width="60"
          color="#EA580C"
          ariaLabel="loading"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <a
              href="/shop"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="flex items-center text-lg font-semibold text-gray-900">
                        <DollarSign className="w-5 h-5 mr-1" />
                        {order.total_amount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">{order.shipping_address}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Delivery Method</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <Truck className="w-4 h-4 mr-1" />
                          {order.delivery_method === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.product?.image_url}
                              alt={item.product?.name}
                              className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;