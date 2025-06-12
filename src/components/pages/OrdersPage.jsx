import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import OrderStatusCard from '@/components/molecules/OrderStatusCard';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import Button from '@/components/atoms/Button';

import { orderService } from '@/services';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = await orderService.getAll();
      setOrders(orderData);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  };

  const getStatusCounts = () => {
    const counts = { all: orders.length };
    orders.forEach(order => {
      counts[order.status] = (counts[order.status] || 0) + 1;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">Your Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Status Filter */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {statusOptions.map((option) => (
              <motion.div key={option.value} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap bg-transparent ${
                    statusFilter === option.value
                      ? 'bg-primary text-white'
                      : 'bg-surface text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {option.label}
                  {statusCounts[option.value] > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      statusFilter === option.value
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {statusCounts[option.value]}
                    </span>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonLoader count={3} className="space-y-4">
            <div className="space-y-3">
                <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </SkeletonLoader>
        ) : error ? (
          <ErrorState message={error} onRetry={loadOrders} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            icon="Package"
            title={statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
            message={statusFilter === 'all' ? 'Start shopping to see your orders here' : `You don't have any ${statusFilter} orders at the moment`}
            actionText={statusFilter === 'all' ? 'Start Shopping' : null}
            onActionClick={statusFilter === 'all' ? () => navigate('/') : null}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OrderStatusCard
                  order={order}
                  onClick={() => navigate(`/order/${order.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Continue Shopping CTA */}
        {filteredOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white"
              >
                Continue Shopping
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;