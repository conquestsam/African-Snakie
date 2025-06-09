import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TailSpin } from 'react-loader-spinner';
import { useProductStore } from '../store';

// Nigerian snack categories with better classification
const nigerianCategories = [
  {
    id: 'sweet-treats',
    name: 'Sweet Treats',
    description: 'Traditional Nigerian sweet snacks and desserts that satisfy your sweet tooth.',
    image: 'https://images.pexels.com/photos/15913452/pexels-photo-15913452/free-photo-of-nigerian-chin-chin.jpeg',
    examples: ['Chin Chin', 'Puff Puff', 'Coconut Candy', 'Groundnut Candy']
  },
  {
    id: 'savory-bites',
    name: 'Savory Bites',
    description: 'Crispy, crunchy, and flavorful Nigerian snacks perfect for any time of day.',
    image: 'https://images.pexels.com/photos/3756523/pexels-photo-3756523.jpeg',
    examples: ['Plantain Chips', 'Yam Chips', 'Akara', 'Meat Pie']
  },
  {
    id: 'spicy-snacks',
    name: 'Spicy & Bold',
    description: 'For those who love heat! Spicy Nigerian snacks that pack a punch.',
    image: 'https://images.pexels.com/photos/8365688/pexels-photo-8365688.jpeg',
    examples: ['Kilishi', 'Pepper Soup Mix', 'Spicy Nuts', 'Suya Spice Mix']
  },
  {
    id: 'healthy-options',
    name: 'Healthy Options',
    description: 'Nutritious Nigerian snacks made from natural ingredients and traditional recipes.',
    image: 'https://images.pexels.com/photos/5718026/pexels-photo-5718026.jpeg',
    examples: ['Roasted Groundnuts', 'Tiger Nuts', 'Dried Fruits', 'Coconut Strips']
  },
  {
    id: 'party-packs',
    name: 'Party Packs',
    description: 'Perfect for sharing! Large portions and variety packs for celebrations.',
    image: 'https://images.pexels.com/photos/7173123/pexels-photo-7173123.jpeg',
    examples: ['Mixed Snack Boxes', 'Family Size Packs', 'Celebration Combos', 'Gift Sets']
  },
  {
    id: 'drinks-beverages',
    name: 'Drinks & Beverages',
    description: 'Traditional Nigerian drinks and beverage mixes to complement your snacks.',
    image: 'https://images.pexels.com/photos/6823655/pexels-photo-6823655.jpeg',
    examples: ['Zobo Mix', 'Kunu Powder', 'Palm Wine', 'Hibiscus Tea']
  }
];

const Categories: React.FC = () => {
  const { categories, isLoading, fetchCategories } = useProductStore();
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  if (isLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex justify-center items-center">
        <TailSpin
          height="60"
          width="60"
          color="#16a34a"
          ariaLabel="loading"
        />
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Nigerian Snack Categories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 max-w-3xl mx-auto text-lg"
          >
            Discover the rich variety of authentic Nigerian snacks, organized by taste, texture, and occasion. 
            From sweet treats to spicy delights, find your perfect snack experience.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {nigerianCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link
                to={`/shop?category=${category.id}`}
                className="block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {category.name}
                    </h3>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* Examples */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Popular Items:</h4>
                    <div className="flex flex-wrap gap-1">
                      {category.examples.slice(0, 3).map((example, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {example}
                        </span>
                      ))}
                      {category.examples.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{category.examples.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                      Explore Category
                    </span>
                    <svg 
                      className="w-5 h-5 text-green-600 transform transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 bg-green-600 text-white p-8 md:p-12 rounded-2xl text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Browse our complete collection of authentic Nigerian snacks or use our search feature to find specific items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse All Snacks
            </Link>
            <Link
              to="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors"
            >
              Request a Snack
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;