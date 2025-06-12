import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ProductListingGrid from '@/components/organisms/ProductListingGrid';
import CategoryDisplayCard from '@/components/molecules/CategoryDisplayCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import Button from '@/components/atoms/Button';

import { productService, cartService } from '@/services';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryProducts();
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const categoryData = await productService.getCategories();
      setCategories(categoryData);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await productService.getByCategory(selectedCategory);
      setProducts(productData);
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

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Electronics': 'Smartphone',
      'Clothing': 'ShirtIcon',
      'Home & Kitchen': 'Home',
      'Sports & Fitness': 'Dumbbell',
      'Accessories': 'Watch',
      'Books': 'Book',
      'Health & Beauty': 'Heart',
      'Toys & Games': 'Gamepad2'
    };
    return iconMap[category] || 'Package';
  };

  const getCategoryColor = (category, index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {selectedCategory && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={() => {
                        setSelectedCategory(null);
                        setProducts([]);
                    }}
                    className="p-2 border border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                    <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                </Button>
              </motion.div>
            )}
            
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">
                {selectedCategory ? selectedCategory : 'Shop by Category'}
              </h1>
              <p className="text-gray-600">
                {selectedCategory 
                  ? `Browse products in ${selectedCategory}`
                  : 'Discover products organized by category'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={selectedCategory ? 6 : 8} className={`grid gap-6 ${selectedCategory ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
            {selectedCategory ? null : ( // Default skeleton for products
              <div className="animate-pulse space-y-4 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            )}
          </SkeletonLoader>
        ) : error ? (
          <ErrorState message={error} onRetry={selectedCategory ? loadCategoryProducts : loadCategories} />
        ) : selectedCategory ? (
          // Category Products View
          <ProductListingGrid
            products={products}
            loading={false} // Already handled above
            error={null}    // Already handled above
            onAddToCart={handleAddToCart}
            onViewDetails={(productId) => navigate(`/product/${productId}`)}
            emptyStateTitle={`No products found in ${selectedCategory}`}
            emptyStateMessage={`No products available in ${selectedCategory} category`}
            icon="Package"
          />
        ) : (
          // Categories Grid View
          <div>
            {categories.length === 0 ? (
              <EmptyState title="No categories found" message="Check back later for new categories" icon="Grid3X3" />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {categories.map((category, index) => (
                  <CategoryDisplayCard
                    key={category}
                    category={category}
                    icon={getCategoryIcon(category)}
                    color={getCategoryColor(category, index)}
                    onClick={() => setSelectedCategory(category)}
                    index={index}
                  />
                ))}
              </motion.div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        {!selectedCategory && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-primary text-white hover:bg-primary/90"
                >
                  Browse All Products
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/cart')}
                  className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white"
                >
                  View Cart
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;