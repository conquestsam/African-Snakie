export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  inventory_count: number;
  discount_percentage?: number;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  vendor_id: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
  updated_at: string;
  shipping_address: string;
  delivery_method: 'standard' | 'express';
  payment_status: 'pending' | 'completed' | 'failed';
  estimated_delivery?: string;
  tracking_number?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_name: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}