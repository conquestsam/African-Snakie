import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Product, Cart, Category } from '../types';
import * as supabaseService from '../lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { user, profile } = await supabaseService.signIn(email, password);
          if (user) {
            set({ 
              user: { ...user, ...profile },
              isAuthenticated: true,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      register: async (email, password, userData) => {
        set({ isLoading: true });
        try {
          await supabaseService.signUp(email, password, userData);
          set({ isLoading: false });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true });
        try {
          await supabaseService.signOut();
          set({ user: null, isAuthenticated: false, isLoading: false });
          useCartStore.getState().clearCart();
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      
      checkAuth: async () => {
        try {
          const { user } = await supabaseService.getCurrentUser();
          if (user) {
            set({ 
              user,
              isAuthenticated: true,
            });
          } else {
            set({ isAuthenticated: false });
            useCartStore.getState().clearCart();
          }
        } catch (error) {
          console.error('Auth check error:', error);
          set({ isAuthenticated: false });
          useCartStore.getState().clearCart();
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: (userId: string) => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  clearCartAfterOrder: (cartId: string) => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,
  
  fetchCart: async (userId) => {
    if (!userId) {
      set({ error: 'User ID is required' });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const cart = await supabaseService.getCart(userId);
      if (!cart) {
        throw new Error('Failed to fetch cart');
      }
      set({ cart, isLoading: false, error: null });
    } catch (error) {
      console.error('Fetch cart error:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart'
      });
    }
  },
  
  addItem: async (productId, quantity) => {
    const { cart } = get();
    const { user } = useAuthStore.getState();
    
    if (!user?.id) {
      set({ error: 'User must be logged in to add items to cart' });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      let currentCart = cart;
      if (!currentCart) {
        const newCart = await supabaseService.getCart(user.id);
        if (!newCart) {
          throw new Error('Failed to create cart');
        }
        currentCart = newCart;
      }
      
      await supabaseService.addToCart(currentCart.id, productId, quantity);
      await get().fetchCart(user.id);
    } catch (error) {
      console.error('Add item error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add item to cart'
      });
    }
  },
  
  updateItem: async (itemId, quantity) => {
    const { cart } = get();
    const { user } = useAuthStore.getState();
    
    if (!cart || !user?.id) {
      set({ error: 'Invalid cart or user' });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      await supabaseService.updateCartItem(itemId, quantity);
      await get().fetchCart(user.id);
    } catch (error) {
      console.error('Update item error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update cart item'
      });
    }
  },
  
  removeItem: async (itemId) => {
    const { cart } = get();
    const { user } = useAuthStore.getState();
    
    if (!cart || !user?.id) {
      set({ error: 'Invalid cart or user' });
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      await supabaseService.removeFromCart(itemId);
      await get().fetchCart(user.id);
    } catch (error) {
      console.error('Remove item error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove cart item'
      });
    }
  },
  
  clearCart: () => {
    set({ cart: null, error: null });
  },

  clearCartAfterOrder: async (cartId) => {
    try {
      await supabaseService.clearCart(cartId);
      set({ cart: null, error: null });
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }
}));

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string) => Promise<Product[]>;
  getProductsByCategory: (categoryId: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()((set) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await supabaseService.getProducts();
      set({ products, isLoading: false, error: null });
    } catch (error) {
      console.error('Fetch products error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  },
  
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const featuredProducts = await supabaseService.getFeaturedProducts();
      set({ featuredProducts, isLoading: false, error: null });
    } catch (error) {
      console.error('Fetch featured products error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch featured products'
      });
    }
  },
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await supabaseService.getCategories();
      set({ categories, isLoading: false, error: null });
    } catch (error) {
      console.error('Fetch categories error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories'
      });
    }
  },
  
  searchProducts: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const products = await supabaseService.searchProducts(query);
      set({ isLoading: false, error: null });
      return products;
    } catch (error) {
      console.error('Search products error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to search products'
      });
      return [];
    }
  },
  
  getProductsByCategory: async (categoryId) => {
    set({ isLoading: true, error: null });
    try {
      const products = await supabaseService.getProductsByCategory(categoryId);
      set({ products, isLoading: false, error: null });
    } catch (error) {
      console.error('Get products by category error:', error);
      set({ 
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch category products'
      });
    }
  }
}));