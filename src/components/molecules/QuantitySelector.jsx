import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, min = 1, max = Infinity }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-lg">
      <Button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="p-2 hover:bg-gray-50 transition-colors bg-transparent"
      >
        <ApperIcon name="Minus" className="w-4 h-4" />
      </Button>
      <span className="px-4 py-2 min-w-[60px] text-center">
        {quantity}
      </span>
      <Button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="p-2 hover:bg-gray-50 transition-colors bg-transparent"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default QuantitySelector;