import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import ProductCard from './ProductCard';
import OrderStatus from './OrderStatus';
import { productService, cartService, orderService } from '../services';

const MainFeature = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'browse') {
        const featured = await productService.getFeatured();
        setFeaturedProducts(featured);
      } else if (activeTab === 'orders') {
        const orders = await orderService.getRecentOrders(3);
        setRecentOrders(orders);
      }
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load data');
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

  const tabs = [
    { id: 'browse', label: 'Featured Products', icon: 'Star' },
    { id: 'orders', label: 'Recent Orders', icon: 'Package' },
    { id: 'quick-actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  const SkeletonLoader = ({ count = 3 }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-lg p-6 shadow-sm"
        >
          <div className="animate-pulse space-y-3">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </motion.div>
      ))}
    </div>
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
        onClick={loadData}
        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Try Again
      </motion.button>
    </motion.div>
  );

  const renderTabContent = () => {
    if (loading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return <ErrorState />;
    }

    switch (activeTab) {
      case 'browse':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Featured Products</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                View All Products →
              </motion.button>
            </div>
            
            {featuredProducts.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Star" className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-2">No featured products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product, index) => (
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
              </div>
            )}
          </div>
        );

      case 'orders':
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/orders')}
                className="text-primary hover:text-primary/80 font-medium"
              >
                View All Orders →
              </motion.button>
            </div>
            
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Package" className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-gray-500 mt-2">No recent orders found</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Start Shopping
                </motion.button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OrderStatus
                      order={order}
                      onClick={() => navigate(`/order/${order.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      case 'quick-actions':
        return (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: 'ShoppingCart', label: 'View Cart', action: () => navigate('/cart') },
                { icon: 'Package', label: 'Track Orders', action: () => navigate('/orders') },
                { icon: 'Grid3X3', label: 'Browse Categories', action: () => navigate('/categories') },
                { icon: 'Search', label: 'Search Products', action: () => navigate('/') }
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={action.action}
                  className="bg-surface p-6 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 text-center"
                >
                  <ApperIcon name={action.icon} className="w-8 h-8 text-primary mx-auto mb-3" />
                  <span className="text-gray-900 font-medium">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-100">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainFeature;