import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const OrderItemsSummary = ({ orderItems, products, formatPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
      
      <div className="space-y-4">
        {orderItems.map((item, index) => {
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
  );
};

export default OrderItemsSummary;