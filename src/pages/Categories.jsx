import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import ProductCard from '../components/ProductCard';
import { productService, cartService } from '../services';

const Categories = () => {
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

  const SkeletonLoader = ({ count = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-lg p-6 shadow-sm"
        >
          <div className="animate-pulse space-y-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name="Grid3X3" className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No categories found</h3>
      <p className="mt-2 text-gray-500">Check back later for new categories</p>
    </motion.div>
  );

  const ErrorState = () => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Something went wrong</h3>
      <p className="mt-2 text-gray-500">{error}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={selectedCategory ? loadCategoryProducts : loadCategories}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {selectedCategory && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(null);
                  setProducts([]);
                }}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-5 h-5" />
              </motion.button>
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
          <SkeletonLoader />
        ) : error ? (
          <ErrorState />
        ) : selectedCategory ? (
          // Category Products View
          <div>
            {products.length === 0 ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <ApperIcon name="Package" className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-500">
                  No products available in {selectedCategory} category
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onViewDetails={() => navigate(`/product/${product.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          // Categories Grid View
          <div>
            {categories.length === 0 ? (
              <EmptyState />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {categories.map((category, index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    onClick={() => setSelectedCategory(category)}
                    className="bg-surface rounded-lg p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 text-center"
                  >
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${getCategoryColor(category, index)}`}>
                      <ApperIcon 
                        name={getCategoryIcon(category)} 
                        className="w-8 h-8 text-white" 
                      />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category}
                    </h3>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      Explore our {category.toLowerCase()} collection
                    </p>
                    
                    <div className="flex items-center justify-center text-primary font-medium">
                      <span className="mr-2">Browse</span>
                      <ApperIcon name="ArrowRight" className="w-4 h-4" />
                    </div>
                  </motion.div>
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse All Products
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/cart')}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                View Cart
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Categories;