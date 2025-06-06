import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Filter, ChevronUp } from 'lucide-react';
import type { Category } from '../../types';
import Button from '../ui/Button';

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onSortChange: (sort: string) => void;
  selectedSort: string;
  onPriceRangeChange: (min: number, max: number) => void;
  onFilterToggle?: () => void;
  isMobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onSortChange,
  selectedSort,
  onPriceRangeChange,
  onFilterToggle,
  isMobile = false,
}) => {
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    sort: true,
  });
  
  const handlePriceFilter = () => {
    const min = minPrice ? Number(minPrice) : 0;
    const max = maxPrice ? Number(maxPrice) : 1000;
    onPriceRangeChange(min, max);
  };
  
  const resetFilters = () => {
    onCategoryChange(null);
    onSortChange('newest');
    onPriceRangeChange(0, 1000);
    setMinPrice('');
    setMaxPrice('');
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'name', label: 'Name: A to Z' },
  ];

  // Nigerian snack categories for filtering
  const nigerianCategories = [
    { id: 'sweet-treats', name: 'Sweet Treats' },
    { id: 'savory-bites', name: 'Savory Bites' },
    { id: 'spicy-snacks', name: 'Spicy & Bold' },
    { id: 'healthy-options', name: 'Healthy Options' },
    { id: 'party-packs', name: 'Party Packs' },
    { id: 'drinks-beverages', name: 'Drinks & Beverages' },
  ];
  
  const FilterSection = ({ title, isExpanded, onToggle, children }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  return (
    <div className={`bg-white rounded-lg shadow-md ${isMobile ? 'h-full overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg flex items-center">
          <Filter className="h-5 w-5 mr-2 text-green-600" />
          Filters & Sort
        </h3>
        
        {isMobile && (
          <button 
            onClick={onFilterToggle} 
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Sort (Mobile Priority) */}
        <FilterSection
          title="Sort By"
          isExpanded={expandedSections.sort}
          onToggle={() => toggleSection('sort')}
        >
          <div className="grid grid-cols-1 gap-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={selectedSort === option.value}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Categories */}
        <FilterSection
          title="Categories"
          isExpanded={expandedSections.categories}
          onToggle={() => toggleSection('categories')}
        >
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === null}
                onChange={() => onCategoryChange(null)}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700 font-medium">All Categories</span>
            </label>
            
            {nigerianCategories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => onCategoryChange(category.id)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          isExpanded={expandedSections.price}
          onToggle={() => toggleSection('price')}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="$100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePriceFilter}
              className="w-full border-green-600 text-green-600 hover:bg-green-50"
            >
              Apply Price Filter
            </Button>
          </div>
        </FilterSection>

        {/* Quick Price Filters */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 text-sm">Quick Price Filters</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPriceRangeChange(0, 10)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              Under $10
            </button>
            <button
              onClick={() => onPriceRangeChange(10, 25)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              $10 - $25
            </button>
            <button
              onClick={() => onPriceRangeChange(25, 50)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              $25 - $50
            </button>
            <button
              onClick={() => onPriceRangeChange(50, 1000)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              Over $50
            </button>
          </div>
        </div>

        {/* Reset Filters */}
        <div className="pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetFilters} 
            fullWidth
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;