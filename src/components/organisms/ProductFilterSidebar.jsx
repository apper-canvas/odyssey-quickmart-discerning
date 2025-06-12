import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ProductFilterSidebar = ({
  isOpen,
  onToggle,
  filters,
  onFiltersChange,
  categories = [],
  priceRange = { min: 0, max: 1000 },
  onClearFilters
}) => {
  const handlePriceChange = (type, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: parseFloat(value)
      }
    });
  };

  const handleCategoryChange = (category, checked) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: updatedCategories
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? 0 : rating
    });
  };

  const handleAvailabilityChange = (checked) => {
    onFiltersChange({
      ...filters,
      inStockOnly: checked
    });
  };

  const renderStars = (rating, selected) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <ApperIcon
            key={star}
            name="Star"
            className={`w-4 h-4 ${
              star <= rating
                ? selected
                  ? 'text-yellow-400 fill-current'
                  : 'text-yellow-300 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-2">
              <Button
                onClick={onClearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 bg-transparent p-1"
              >
                Clear All
              </Button>
              <Button
                onClick={onToggle}
                className="lg:hidden p-2 bg-transparent text-gray-500 hover:text-gray-700"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Min: ${filters.priceRange.min}
                  </label>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Max: ${filters.priceRange.max}
                  </label>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange.min}</span>
                  <span>${priceRange.max}</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => handleCategoryChange(category, e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingChange(rating)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${
                      filters.minRating === rating
                        ? 'bg-primary bg-opacity-10 border border-primary'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {renderStars(rating, filters.minRating === rating)}
                    <span className="text-sm text-gray-700">& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => handleAvailabilityChange(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Filter Button */}
      <Button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-primary text-white rounded-full p-4 shadow-lg"
      >
        <ApperIcon name="Filter" className="w-5 h-5" />
      </Button>
    </>
  );
};

export default ProductFilterSidebar;