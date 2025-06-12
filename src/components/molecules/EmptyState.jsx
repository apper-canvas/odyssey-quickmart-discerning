import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ icon = 'Package', title, message, actionText, onActionClick }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <ApperIcon name={icon} className="w-16 h-16 text-gray-300 mx-auto" />
      </motion.div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-500">{message}</p>
      {onActionClick && actionText && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onActionClick}
            className="mt-6 px-6 py-3 bg-primary text-white hover:bg-primary/90"
          >
            {actionText}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;