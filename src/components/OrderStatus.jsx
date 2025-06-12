import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const OrderStatus = ({ order, onClick }) => {
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
        label: 'Pending'
      },
      processing: {
        color: 'bg-info text-white',
        icon: 'Package',
        label: 'Processing'
      },
      shipped: {
        color: 'bg-accent text-white',
        icon: 'Truck',
        label: 'Shipped'
      },
      delivered: {
        color: 'bg-success text-white',
        icon: 'CheckCircle',
        label: 'Delivered'
      }
    };

    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-surface rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
          <p className="text-sm text-gray-500">
            Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
            <ApperIcon name={statusConfig.icon} className="w-3 h-3" />
            {statusConfig.label}
          </span>
          <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {order.items.length} item{order items.length !== 1 ? 's' : ''}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-sm font-medium text-gray-900">
            {formatPrice(order.total)}
          </span>
        </div>

        {order.estimatedDelivery && order.status !== 'delivered' && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Estimated delivery</p>
            <p className="text-sm font-medium text-gray-900">
              {format(new Date(order.estimatedDelivery), 'MMM dd')}
            </p>
          </div>
        )}
      </div>

      {/* Order Items Preview */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Package" className="w-4 h-4" />
          <span>
            {order.items.map((item, index) => (
              <span key={item.productId}>
                {item.quantity}x Item
                {index < order.items.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatus;