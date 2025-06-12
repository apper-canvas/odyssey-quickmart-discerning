import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CategoryDisplayCard = ({ category, icon, color, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className="bg-surface rounded-lg p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 text-center"
    >
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${color}`}>
        <ApperIcon 
          name={icon} 
          className="w-8 h-8 text-white" 
        />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {category}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4">
        Explore our {category.toLowerCase()} collection
      </p>
      
      <div className="flex items-center justify-center text-primary font-medium">
        <span className="mr-2">Browse</span>
        <ApperIcon name="ArrowRight" className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

export default CategoryDisplayCard;