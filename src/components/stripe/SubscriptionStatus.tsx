import React, { useEffect, useState } from 'react';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { getUserSubscription } from '../../lib/stripe';
import { useAuthStore } from '../../store';
import { getProductByPriceId } from '../../stripe-config';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated]);

  const fetchSubscription = async () => {
    try {
      const data = await getUserSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return null;
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null;
  const isActive = subscription.subscription_status === 'active';
  const isPastDue = subscription.subscription_status === 'past_due';
  const isCanceled = subscription.subscription_status === 'canceled';

  const getStatusColor = () => {
    if (isActive) return 'text-green-600 bg-green-100';
    if (isPastDue) return 'text-yellow-600 bg-yellow-100';
    if (isCanceled) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusIcon = () => {
    if (isActive) return <Crown className="h-4 w-4" />;
    if (isPastDue) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-1 capitalize">{subscription.subscription_status.replace('_', ' ')}</span>
        </div>
      </div>

      {product && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900">{product.name}</h4>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {subscription.current_period_end && (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
              {formatDate(subscription.current_period_end)}
            </span>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-600">
              {subscription.payment_method_brand.toUpperCase()} ****{subscription.payment_method_last4}
            </span>
          </div>
        )}
      </div>

      {subscription.cancel_at_period_end && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Your subscription will not renew and will end on{' '}
            {subscription.current_period_end && formatDate(subscription.current_period_end)}.
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;