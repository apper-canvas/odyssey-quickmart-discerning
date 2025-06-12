import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { orderService, productService } from '../services';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await orderService.getById(id);
      setOrder(orderData);
      
      // Load product details for order items
      const productPromises = orderData.items.map(item => 
        productService.getById(item.productId).catch(() => null)
      );
      const productData = await Promise.all(productPromises);
      
      const productMap = {};
      productData.forEach(product => {
        if (product) {
          productMap[product.id] = product;
        }
      });
      setProducts(productMap);
    } catch (err) {
      setError(err.message || 'Failed to load order');
      toast.error('Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-warning text-white',
        icon: 'Clock',
        label: 'Pending',
        description: 'Your order is being processed'
      },
      processing: {
        color: 'bg-info text-white',
        icon: 'Package',
        label: 'Processing',
        description: 'Your order is being prepared for shipment'
      },
      shipped: {
        color: 'bg-accent text-white',
        icon: 'Truck',
        label: 'Shipped',
        description: 'Your order is on the way'
      },
      delivered: {
        color: 'bg-success text-white',
        icon: 'CheckCircle',
        label: 'Delivered',
        description: 'Your order has been delivered'
      }
    };

    return configs[status] || configs.pending;
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: 'ShoppingBag' },
      { status: 'processing', label: 'Processing', icon: 'Package' },
      { status: 'shipped', label: 'Shipped', icon: 'Truck' },
      { status: 'delivered', label: 'Delivered', icon: 'CheckCircle' }
    ];

    const currentIndex = steps.findIndex(step => step.status === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Order not found</h3>
            <p className="mt-2 text-gray-500">{error}</p>
            <div className="mt-6 space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                View All Orders
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="hover:text-primary transition-colors"
          >
            Orders
          </button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900">Order #{order.id}</span>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">
                Order #{order.id}
              </h1>
              <p className="text-gray-600">
                Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')} at {format(new Date(order.createdAt), 'h:mm a')}
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${statusConfig.color} w-fit`}>
              <ApperIcon name={statusConfig.icon} className="w-4 h-4" />
              {statusConfig.label}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
                <div 
                  className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-1000"
                  style={{ height: `${(statusSteps.findIndex(s => s.current) + 1) * 25}%` }}
                ></div>
                
                {/* Status Steps */}
                <div className="space-y-8">
                  {statusSteps.map((step, index) => (
                    <div key={step.status} className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        <ApperIcon name={step.icon} className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </h3>
                        
                        {/* Timeline Entry */}
                        {order.timeline && order.timeline.find(t => t.status === step.status) && (
                          <div className="mt-1">
                            <p className="text-sm text-gray-600">
                              {order.timeline.find(t => t.status === step.status).description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(
                                new Date(order.timeline.find(t => t.status === step.status).timestamp), 
                                'MMM dd, yyyy at h:mm a'
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const product = products[item.productId];
                  if (!product) {
                    return (
                      <div key={item.productId} className="text-center text-gray-500 py-4">
                        Product information unavailable
                      </div>
                    );
                  }

                  return (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        loading="lazy"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 break-words">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface rounded-lg p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{order.shippingAddress.street}</p>
                <p className="text-gray-900">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-900">{order.shippingAddress.country}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-lg p-6 shadow-sm sticky top-6 space-y-6"
            >
              {/* Order Summary */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({order.items.length})</span>
                    <span className="font-medium">{formatPrice(order.total * 0.85)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">{formatPrice(order.total * 0.08)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-success">FREE</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && order.status !== 'delivered' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estimated Delivery</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-900">
                      {format(new Date(order.estimatedDelivery), 'EEEE, MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/orders')}
                  className="w-full px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  View All Orders
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/')}
                  className="w-full px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-110 transition-all"
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;