import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import QuantitySelector from '@/components/molecules/QuantitySelector';

const CartItemCard = ({ item, product, updateQuantity, removeItem, formatPrice, index }) => {
  if (!product) {
    return (
      <div key={item.productId} className="bg-surface rounded-lg p-4 shadow-sm">
        <div className="text-center text-gray-500">
          Product information unavailable
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={item.productId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          loading="lazy"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 break-words">
              {product.name}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeItem(item.productId)}
              className="text-error hover:text-error/80 ml-4"
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </motion.button>
          </div>
          
          <p className="text-sm text-gray-500 mb-3">
            {formatPrice(item.price)} each
          </p>
          
          <div className="flex items-center justify-between">
            <QuantitySelector
              quantity={item.quantity}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              max={product.stock}
            />
            
            <div className="text-lg font-bold text-primary">
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItemCard;