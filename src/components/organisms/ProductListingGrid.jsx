import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/molecules/ProductCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

const ProductListingGrid = ({
  products,
  loading,
  error,
  viewMode = 'grid',
  onAddToCart,
  onViewDetails,
  onRetry,
  emptyStateTitle,
  emptyStateMessage,
  emptyStateActionText,
  onEmptyStateActionClick,
  searchQuery // Used for empty state message
}) => {

  const skeletonCount = viewMode === 'grid' ? 8 : 3;
  const skeletonClassName = viewMode === 'grid' 
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
    : 'grid-cols-1 space-y-4';
  const skeletonItemClassName = viewMode === 'list' ? 'p-4' : 'p-6';

  if (loading) {
    return (
      <SkeletonLoader count={skeletonCount} className={`grid gap-6 ${skeletonClassName}`} itemClassName={skeletonItemClassName}>
        {viewMode === 'list' ? (
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </>
        )}
      </SkeletonLoader>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="Package"
        title={emptyStateTitle || 'No products found'}
        message={emptyStateMessage || (searchQuery ? `No results for "${searchQuery}"` : 'No products available')}
        actionText={emptyStateActionText}
        onActionClick={onEmptyStateActionClick}
      />
    );
  }

  return (
    <motion.div
      className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ProductCard
            product={product}
            viewMode={viewMode}
            onAddToCart={onAddToCart}
            onViewDetails={() => onViewDetails(product.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductListingGrid;