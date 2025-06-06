import React from 'react';
import CustomersTable from '../../components/admin/CustomersTable';

const CustomerManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customer Management</h1>
      <CustomersTable />
    </div>
  );
};

export default CustomerManagement;