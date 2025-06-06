import React from 'react';
import ProductsTable from '../../components/admin/ProductsTable';

const ProductManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Management</h1>
      <ProductsTable />
    </div>
  );
};

export default ProductManagement;