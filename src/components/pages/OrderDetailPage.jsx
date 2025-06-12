import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import OrderStatusTimeline from '@/components/organisms/OrderStatusTimeline';
import OrderItemsSummary from '@/components/organisms/OrderItemsSummary';
import OrderSummaryBox from '@/components/organisms/OrderSummaryBox';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';

import { orderService, productService } from '@/services';

const OrderDetailPage = () => {
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
          <ErrorState
            message={error}
            retryText="View All Orders"
            onRetry={() => navigate('/orders')}
          />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const calculatedItemsTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const calculatedTax = calculatedItemsTotal * 0.08; // Assuming 8% tax
  const calculatedShipping = calculatedItemsTotal > 50 ? 0 : 9.99; // Assuming free shipping over $50
  const calculatedTotal = calculatedItemsTotal + calculatedTax + calculatedShipping;


  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Button
            onClick={() => navigate('/orders')}
            className="hover:text-primary transition-colors bg-transparent p-0"
          >
            Orders
          </Button>
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
            <OrderStatusTimeline order={order} />

            <OrderItemsSummary orderItems={order.items} products={products} formatPrice={formatPrice} />

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
            <OrderSummaryBox
              subtotal={calculatedItemsTotal}
              tax={calculatedTax}
              shipping={calculatedShipping}
              total={calculatedTotal}
              formatPrice={formatPrice}
              showCheckoutButton={false}
              onContinueShopping={() => navigate('/')}
              continueShoppingButtonText="Continue Shopping"
            >
              {/* Additional sections for order detail summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900">{order.paymentMethod}</p>
                </div>
              </div>

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
            </OrderSummaryBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;