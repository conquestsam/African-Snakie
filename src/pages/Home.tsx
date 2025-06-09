import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import NewsletterSignup from '../components/home/NewsletterSignup';
import { useAuthStore, useProductStore, useCartStore } from '../store';

const Home: React.FC = () => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const { fetchFeaturedProducts, fetchCategories } = useProductStore();
  const { fetchCart } = useCartStore();
  
  useEffect(() => {
    // Check authentication status
    checkAuth();
    
    // Load featured products and categories
    fetchFeaturedProducts();
    fetchCategories();
  }, [checkAuth, fetchFeaturedProducts, fetchCategories]);
  
  useEffect(() => {
    // If user is authenticated, fetch their cart
    if (isAuthenticated && user) {
      fetchCart(user.id);
    }
  }, [isAuthenticated, user, fetchCart]);
  
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <NewsletterSignup />
    </div>
  );
};

export default Home;