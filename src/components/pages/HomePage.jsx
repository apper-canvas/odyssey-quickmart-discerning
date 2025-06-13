import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ProductListingGrid from '@/components/organisms/ProductListingGrid';
import ProductFilterSidebar from '@/components/organisms/ProductFilterSidebar';
import MainFeatureSection from '@/components/organisms/MainFeatureSection';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

import { productService, cartService } from '@/services';

const HomePage = () => {
  const navigate = useNavigate();
const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    categories: [],
    minRating: 0,
    inStockOnly: false
  });

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, filters]);

  useEffect(() => {
    loadPriceRange();
  }, []);

const loadPriceRange = async () => {
    try {
      const range = await productService.getPriceRange();
      setPriceRange(range);
      setFilters(prev => ({
        ...prev,
        priceRange: range
      }));
    } catch (err) {
      console.error('Failed to load price range:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let productData;
      
      if (searchQuery.trim()) {
        // Search with filters
        productData = await productService.search(searchQuery);
        if (filters.categories.length > 0 || filters.minRating > 0 || filters.inStockOnly || 
            filters.priceRange.min > priceRange.min || filters.priceRange.max < priceRange.max) {
          productData = await productService.filterProducts(productData, filters);
        }
      } else if (selectedCategory === 'all') {
        // All products with filters
        productData = await productService.getAll();
        productData = await productService.filterProducts(productData, filters);
      } else {
        // Category with filters
        productData = await productService.getByCategory(selectedCategory);
        productData = await productService.filterProducts(productData, filters);
      }
      
      setProducts(productData);
      
      if (categories.length === 0) {
        const categoryData = await productService.getCategories();
        setCategories(['all', ...categoryData]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      priceRange: priceRange,
      categories: [],
      minRating: 0,
      inStockOnly: false
    });
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleAddToCart = async (product, quantity = 1) => {
    try {
      await cartService.addItem(product.id, quantity, product.price);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
<div className="mb-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            Discover Amazing Products at Unbeatable Prices
          </h1>
          <p className="text-gray-600 mb-6">Your one-stop destination for quality products with lightning-fast delivery</p>
          <div className="flex justify-center mb-4">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="Shopping experience at QuickMart with diverse products and happy customers"
              className="rounded-lg shadow-lg max-w-full h-48 md:h-64 object-cover"
            />
          </div>
        </div>

        <div className="mb-8">
          <MainFeatureSection />
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <ProductFilterSidebar
                isOpen={true}
                onToggle={() => {}}
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories.filter(cat => cat !== 'all')}
                priceRange={priceRange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Mobile Filter Toggle */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <Button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2"
                >
                  <ApperIcon name="Filter" className="w-4 h-4" />
                  Filters
                </Button>

                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <ApperIcon 
                    name="Search" 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                  />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </Select>

                {/* View Mode Toggle */}
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <Button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 bg-transparent ${
                      viewMode === 'grid'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    className={`p-2 bg-transparent ${
                      viewMode === 'list'
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product List */}
            <ProductListingGrid
              products={products}
              loading={loading}
              error={error}
              viewMode={viewMode}
              onAddToCart={handleAddToCart}
              onViewDetails={(productId) => navigate(`/product/${productId}`)}
              onRetry={loadData}
              emptyStateTitle="No products found"
              emptyStateMessage={searchQuery ? `No results for "${searchQuery}"` : 'No products available with current filters'}
              emptyStateActionText={searchQuery || filters.categories.length > 0 || filters.minRating > 0 || filters.inStockOnly ? 'Clear Filters' : null}
              onEmptyStateActionClick={searchQuery || filters.categories.length > 0 || filters.minRating > 0 || filters.inStockOnly ? handleClearFilters : null}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Mobile Filter Sidebar */}
        <ProductFilterSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories.filter(cat => cat !== 'all')}
          priceRange={priceRange}
          onClearFilters={handleClearFilters}
        />
      </div>
    </div>
  );
};

export default HomePage;