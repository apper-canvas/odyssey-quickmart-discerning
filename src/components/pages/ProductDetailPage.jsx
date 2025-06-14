import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ReactImageZoom from 'react-image-zoom';
import ApperIcon from '@/components/ApperIcon';
import QuantitySelector from '@/components/molecules/QuantitySelector';
import Button from '@/components/atoms/Button';
import ErrorState from '@/components/molecules/ErrorState';

import { productService, cartService } from '@/services';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await productService.getById(id);
      setProduct(productData);
      setQuantity(1); // Reset quantity on product change
    } catch (err) {
      setError(err.message || 'Failed to load product');
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await cartService.addItem(product.id, quantity, product.price);
      toast.success(`${quantity}x ${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

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
      stars.push(<ApperIcon key={i} name="Star" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<ApperIcon key="half" name="StarHalf" className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<ApperIcon key={`empty-${i}`} name="Star" className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <ErrorState 
            message={error} 
            retryText="Go Back" 
            onRetry={() => navigate(-1)} 
          >
            <div className="mt-6 space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-primary text-white hover:bg-primary/90"
                >
                  Browse Products
                </Button>
              </motion.div>
            </div>
          </ErrorState>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Button
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors bg-transparent p-0"
          >
            Home
          </Button>
          <ApperIcon name="ChevronRight" className="w-4 h-4" />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
{/* Product Image Carousel */}
          <div className="relative">
            {/* Main Image Display */}
            <div className="relative group">
              {product.images && product.images.length > 1 ? (
                <>
                  <div 
                    className="w-full aspect-square object-cover rounded-lg shadow-sm cursor-zoom-in overflow-hidden"
                    onClick={() => setShowZoom(true)}
                  >
                    <img
                      src={product.images[selectedImageIndex]}
                      alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === 0 ? product.images.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <ApperIcon name="ChevronLeft" className="w-5 h-5 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex(prev => 
                          prev === product.images.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-700" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div 
                  className="w-full aspect-square object-cover rounded-lg shadow-sm cursor-zoom-in overflow-hidden"
                  onClick={() => setShowZoom(true)}
                >
                  <img
                    src={product.imageUrl || (product.images && product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImageIndex === index 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Zoom Modal */}
            <AnimatePresence>
              {showZoom && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={() => setShowZoom(false)}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="relative max-w-4xl max-h-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ReactImageZoom
                      width={600}
                      height={600}
                      zoomWidth={400}
                      img={product.images ? product.images[selectedImageIndex] : (product.imageUrl || product.images?.[0])}
                      zoomStyle="opacity: 0.8; background-color: white;"
                    />
                    <button
                      onClick={() => setShowZoom(false)}
                      className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
                    >
                      <ApperIcon name="X" className="w-6 h-6" />
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {product.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-secondary text-white text-sm px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}
            
            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute top-4 right-4">
                <span className="bg-warning text-white text-sm px-3 py-1 rounded-full">
                  Only {product.stock} left
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                
                <span className="text-sm text-gray-500">
                  Category: {product.category}
                </span>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(product.price)}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium text-gray-900">Stock:</span>
                <span className={`text-sm font-medium ${
                  product.stock > 10 
                    ? 'text-success' 
                    : product.stock > 0 
                      ? 'text-warning' 
                      : 'text-error'
                }`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-900">Quantity:</span>
                  <QuantitySelector
                    quantity={quantity}
                    onDecrease={() => setQuantity(prev => Math.max(1, prev - 1))}
                    onIncrease={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                    max={product.stock}
                  />
                </div>
              )}

              <div className="flex gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full border border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <ApperIcon name="ShoppingCart" className="w-5 h-5" />
                        Add to Cart
                    </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                    <Button
                        onClick={handleBuyNow}
                        disabled={product.stock === 0}
                        className="w-full bg-secondary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Buy Now
                    </Button>
                </motion.div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="Truck" className="w-4 h-4" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="RotateCcw" className="w-4 h-4" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ApperIcon name="Shield" className="w-4 h-4" />
                <span>1-year warranty included</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;