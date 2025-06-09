import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
import ProductForm from '../../components/admin/ProductForm';
import * as supabaseService from '../../lib/supabase';
import type { Product } from '../../types';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const data = await supabaseService.getProduct(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <TailSpin
          height="60"
          width="60"
          color="#EA580C"
          ariaLabel="loading"
        />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-lg font-medium text-red-800">Error</h2>
          <p className="mt-2 text-red-700">{error || 'Product not found'}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
      <ProductForm product={product} isEdit={true} />
    </div>
  );
};

export default EditProduct;