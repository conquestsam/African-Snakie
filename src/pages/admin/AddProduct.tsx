import React from 'react';
import ProductForm from '../../components/admin/ProductForm';

const AddProduct: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
};

export default AddProduct;