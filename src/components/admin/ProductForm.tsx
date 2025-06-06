import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import * as supabaseService from '../../lib/supabase';
import type { Product, Category } from '../../types';

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    inventory_count: '',
    discount_percentage: '',
    is_featured: false,
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await supabaseService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };
    
    fetchCategories();
    
    if (isEdit && product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image_url: product.image_url,
        category_id: product.category_id,
        inventory_count: product.inventory_count.toString(),
        discount_percentage: product.discount_percentage?.toString() || '',
        is_featured: product.is_featured,
      });
    }
  }, [isEdit, product]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image_url: formData.image_url,
        category_id: formData.category_id,
        inventory_count: parseInt(formData.inventory_count),
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        is_featured: formData.is_featured,
        vendor_id: 'admin', // In a real app, this would be the actual vendor ID
      };
      
      if (isEdit && product) {
        await supabaseService.updateProduct(product.id, productData);
        toast.success('Product updated successfully');
      } else {
        await supabaseService.addProduct(productData);
        toast.success('Product added successfully');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="inventory_count" className="block text-sm font-medium text-gray-700 mb-1">
              Inventory Count
            </label>
            <input
              id="inventory_count"
              name="inventory_count"
              type="number"
              min="0"
              value={formData.inventory_count}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="discount_percentage" className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage (%)
            </label>
            <input
              id="discount_percentage"
              name="discount_percentage"
              type="number"
              min="0"
              max="100"
              value={formData.discount_percentage}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                Feature this product on homepage
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEdit ? 'Update Product' : 'Add Product'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/products')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;