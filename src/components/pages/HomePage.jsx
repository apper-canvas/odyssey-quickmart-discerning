import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ProductListingGrid from '@/components/organisms/ProductListingGrid';
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

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let productData;
      
      if (searchQuery.trim()) {
        productData = await productService.search(searchQuery);
      } else if (selectedCategory === 'all') {
        productData = await productService.getAll();
      } else {
        productData = await productService.getByCategory(selectedCategory);
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
            Welcome to QuickMart
          </h1>
          <p className="text-gray-600">Fast, reliable shopping for everything you need</p>
        </div>

        <div className="mb-8">
            <MainFeatureSection />
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
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
          emptyStateMessage={searchQuery ? `No results for "${searchQuery}"` : 'No products available in this category'}
          emptyStateActionText={searchQuery ? 'Clear Search' : null}
          onEmptyStateActionClick={searchQuery ? () => setSearchQuery('') : null}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default HomePage;