import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ProductCard = ({ product, viewMode = 'grid', onAddToCart, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<ApperIcon key={i} name="Star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<ApperIcon key="half" name="StarHalf" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<ApperIcon key={`empty-${i}`} name="Star" className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-surface rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 break-words">
                {product.name}
              </h3>
              <div className="text-xl font-bold text-primary ml-4">
                {formatPrice(product.price)}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 break-words">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-500 ml-1">
                    ({product.reviews})
                  </span>
                </div>
                
                <span className="text-sm text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onViewDetails}
                  className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  View Details
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ApperIcon name="ShoppingCart" className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100"
    >
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
        
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2">
            <span className="bg-warning text-white text-xs px-2 py-1 rounded-full">
              Low Stock
            </span>
          </div>
        )}
        
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-error text-white px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 break-words">
          {product.description}
        </p>
        
        <div className="flex items-center gap-1 mb-3">
          {renderStars(product.rating)}
          <span className="text-sm text-gray-500 ml-1">
            ({product.reviews})
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;