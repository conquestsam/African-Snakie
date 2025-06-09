import React from 'react';
import OrdersTable from '../../components/admin/OrdersTable';

const OrderManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>
      <OrdersTable />
    </div>
  );
};

export default OrderManagement;