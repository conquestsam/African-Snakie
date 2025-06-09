import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search } from 'lucide-react';
import { useProductStore } from '../store';
import SearchBar from '../components/shop/SearchBar';
import ProductFilters from '../components/shop/ProductFilters';
import ProductGrid from '../components/shop/ProductGrid';
import Button from '../components/ui/Button';
import type { Product } from '../types';

const Shop: React.FC = () => {
  const { products, categories, isLoading, fetchProducts, fetchCategories } = useProductStore();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);
  
  useEffect(() => {
    // Apply filters and sorting to products
    let result = [...products];
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category_id === selectedCategory);
    }
    
    // Filter by price range
    result = result.filter(product => {
      const price = product.price * (1 - (product.discount_percentage || 0) / 100);
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (selectedSort) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'popular':
        // In a real app, this would sort by popularity metrics
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, selectedSort, priceRange, searchQuery]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
  };
  
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
  };
  
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };
  
  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Nigerian Snacks Collection
          </h1>
          <p className="text-gray-600">
            Discover authentic Nigerian snacks from across the country.
          </p>
        </div>
        
        {/* Mobile Controls */}
        <div className="lg:hidden mb-6 space-y-3">
          {/* Search Toggle */}
          <div className="flex gap-2">
            <Button
              onClick={toggleMobileSearch}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
              leftIcon={<Search className="h-4 w-4" />}
            >
              Search
            </Button>
            <Button
              onClick={toggleMobileFilters}
              variant="outline"
              className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
              leftIcon={<Filter className="h-4 w-4" />}
            >
              Filters & Sort
            </Button>
          </div>

          {/* Mobile Search Bar */}
          {showMobileSearch && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <span className="text-sm text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:block mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-28">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                selectedSort={selectedSort}
                onPriceRangeChange={handlePriceRangeChange}
              />
            </div>
          </div>
          
          {/* Products */}
          <div className="lg:w-3/4">
            {/* Desktop Results Summary */}
            <div className="hidden lg:flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
              <span className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <ProductGrid products={filteredProducts} isLoading={isLoading} viewMode={viewMode} />
          </div>
        </div>
        
        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
                selectedSort={selectedSort}
                onPriceRangeChange={handlePriceRangeChange}
                onFilterToggle={toggleMobileFilters}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;