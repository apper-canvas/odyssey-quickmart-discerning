import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import EmptyState from '@/components/molecules/EmptyState';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'Categories', path: '/categories', icon: 'Grid3X3' },
    { label: 'Orders', path: '/orders', icon: 'Package' },
    { label: 'Cart', path: '/cart', icon: 'ShoppingCart' }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="text-8xl font-bold text-primary mb-4"
          >
            404
          </motion.div>

          <EmptyState 
            icon="ShoppingCart" 
            title="Page Not Found" 
            message="Oops! The page you're looking for seems to have wandered off. Let's get you back to shopping!"
            actionText="Go to Homepage"
            onActionClick={() => navigate('/')}
          />
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => navigate(-1)}
              className="w-full mt-4 border border-primary text-primary hover:bg-primary hover:text-white"
            >
              Go Back
            </Button>
          </motion.div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Or try these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {links.map((link) => (
                <motion.div key={link.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate(link.path)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary bg-transparent"
                  >
                    <ApperIcon name={link.icon} className="w-4 h-4" />
                    {link.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;