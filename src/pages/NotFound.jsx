import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {/* Animated 404 */}
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

          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6"
          >
            <ApperIcon name="ShoppingCart" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>

          {/* Message */}
          <h1 className="text-2xl font-heading font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off. 
            Let's get you back to shopping!
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Homepage
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors font-medium"
            >
              Go Back
            </motion.button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Or try these popular sections:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'Categories', path: '/categories', icon: 'Grid3X3' },
                { label: 'Orders', path: '/orders', icon: 'Package' },
                { label: 'Cart', path: '/cart', icon: 'ShoppingCart' }
              ].map((link) => (
                <motion.button
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(link.path)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                >
                  <ApperIcon name={link.icon} className="w-4 h-4" />
                  {link.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;