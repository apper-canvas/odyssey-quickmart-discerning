import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import CartItemCard from '@/components/molecules/CartItemCard';
import Button from '@/components/atoms/Button';

const CartOverview = ({ cartItems, products, updateQuantity, removeItem, clearCart, formatPrice }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">
          Shopping Cart ({cartItems.length} items)
        </h1>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                onClick={clearCart}
                className="text-error hover:text-error/80 bg-transparent flex items-center gap-2"
            >
                <ApperIcon name="Trash2" className="w-4 h-4" />
                Clear Cart
            </Button>
        </motion.div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <AnimatePresence>
          {cartItems.map((item, index) => (
            <CartItemCard
              key={item.productId}
              item={item}
              product={products[item.productId]}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
              formatPrice={formatPrice}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default CartOverview;