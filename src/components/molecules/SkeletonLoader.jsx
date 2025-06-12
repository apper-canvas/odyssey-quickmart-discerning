import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 1, className = '', children, itemClassName = '', initialDelay = 0.1 }) => {
  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * initialDelay }}
          className={`bg-surface rounded-lg p-6 shadow-sm ${itemClassName}`}
        >
          <div className="animate-pulse space-y-4">
            {children || (
              <>
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;