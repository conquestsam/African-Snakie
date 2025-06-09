import { createClient } from '@supabase/supabase-js';
import type { User, Product, Category, Cart, CartItem, Order, OrderItem, Review } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Cart Operations
export const getCart = async (userId: string) => {
  if (!userId) throw new Error('User ID is required');
  
  try {
    // First check if user has a cart
    const { data: existingCart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (cartError) throw cartError;
    
    let cart = existingCart;
    
    if (!cart) {
      // Create a new cart if one doesn't exist
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select()
        .single();
      
      if (createError) throw createError;
      cart = newCart;
    }
    
    // Get cart items with product details
    const { data: items, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        products (
          id,
          name,
          description,
          price,
          image_url,
          inventory_count,
          discount_percentage,
          category_id,
          categories (
            id,
            name
          )
        )
      `)
      .eq('cart_id', cart.id);
    
    if (itemsError) throw itemsError;
    
    return {
      ...cart,
      items: items?.map(item => ({
        ...item,
        product: item.products
      })) || []
    };
  } catch (error) {
    console.error('Get cart error:', error);
    throw error;
  }
};

export const addToCart = async (cartId: string, productId: string, quantity: number) => {
  try {
    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select(`
          id,
          cart_id,
          product_id,
          quantity,
          products (
            id,
            name,
            description,
            price,
            image_url,
            inventory_count,
            discount_percentage,
            category_id,
            categories (
              id,
              name
            )
          )
        `)
        .single();
      
      if (error) throw error;
      return { ...data, product: data.products };
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ cart_id: cartId, product_id: productId, quantity })
        .select(`
          id,
          cart_id,
          product_id,
          quantity,
          products (
            id,
            name,
            description,
            price,
            image_url,
            inventory_count,
            discount_percentage,
            category_id,
            categories (
              id,
              name
            )
          )
        `)
        .single();
      
      if (error) throw error;
      return { ...data, product: data.products };
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)
      .select(`
        id,
        cart_id,
        product_id,
        quantity,
        products (
          id,
          name,
          description,
          price,
          image_url,
          inventory_count,
          discount_percentage,
          category_id,
          categories (
            id,
            name
          )
        )
      `)
      .single();
    
    if (error) throw error;
    return { ...data, product: data.products };
  } catch (error) {
    console.error('Update cart item error:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Remove from cart error:', error);
    throw error;
  }
};

export const clearCart = async (cartId: string) => {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Clear cart error:', error);
    throw error;
  }
};

export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          address: userData.address,
          role: 'customer'
        }
      }
    });
    
    if (signUpError) throw signUpError;
    if (!authData.user) throw new Error('User creation failed');

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        address: userData.address,
        role: 'customer'
      });
    
    if (profileError) throw profileError;
    
    return authData;
  } catch (error) {
    console.error('SignUp error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    return { ...data, profile };
  } catch (error) {
    console.error('SignIn error:', error);
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    if (!session?.user) {
      return { user: null, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { user: null, profile: null };
    }

    return {
      user: { ...session.user, ...profile },
      profile
    };
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Product[];
};

export const getFeaturedProducts = async (limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_featured', true)
    .limit(limit)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Product[];
};

export const getProductsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Product[];
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Product;
};

export const searchProducts = async (query: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .ilike('name', `%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Product[];
};

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) throw error;
  return data as Category[];
};

// Orders
export const createOrder = async (userId: string, orderData: Partial<Order>, items: Partial<OrderItem>[]) => {
  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        ...orderData
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      ...item
    }));
    
    const { data: orderItemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();
    
    if (itemsError) throw itemsError;
    
    return { ...order, items: orderItemsData };
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status'], paymentStatus?: string) => {
  try {
    const updateData: any = { status };
    if (paymentStatus) {
      updateData.payment_status = paymentStatus;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
};

export const getOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Order[];
};

export const getOrder = async (orderId: string) => {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(
        *,
        products(*)
      )
    `)
    .eq('id', orderId)
    .single();
  
  if (orderError) throw orderError;
  
  return order as Order;
};

// Admin functions
export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      profiles(email, first_name, last_name),
      order_items(
        *,
        products(*)
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getAllCustomers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addProduct = async (productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProduct = async (productId: string, productData: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', productId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (error) throw error;
  return true;
};

export const addCategory = async (categoryData: Partial<Category>) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(categoryData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Reviews
export const getProductReviews = async (productId: string) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles(first_name, last_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Review[];
};

export const addReview = async (reviewData: Partial<Review>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};