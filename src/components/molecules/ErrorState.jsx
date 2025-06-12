import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message = 'Something went wrong', onRetry, retryText = 'Try Again' }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Error!</h3>
      <p className="mt-2 text-gray-500">{message}</p>
      {onRetry && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-primary text-white hover:bg-primary/90"
            >
                {retryText}
            </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;