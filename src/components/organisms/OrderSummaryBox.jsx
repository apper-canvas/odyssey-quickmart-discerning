import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const OrderSummaryBox = ({
  subtotal,
  tax,
  shipping,
  total,
  formatPrice,
  onProceedToCheckout,
  onContinueShopping,
  showCheckoutButton = true,
  checkoutButtonText = 'Proceed to Checkout',
  continueShoppingButtonText = 'Continue Shopping',
  processing = false,
  showSecurityBadges = false
}) => {
  const isFreeShipping = shipping === 0;
  const remainingForFreeShipping = 50 - subtotal;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface rounded-lg p-6 shadow-sm sticky top-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className={`font-medium ${isFreeShipping ? 'text-success' : ''}`}>
            {isFreeShipping ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>
        
        {remainingForFreeShipping > 0 && subtotal < 50 && (
          <div className="text-sm text-info bg-info/10 p-2 rounded-lg">
            Add {formatPrice(remainingForFreeShipping)} more for free shipping!
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
      
      {showCheckoutButton && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
                onClick={onProceedToCheckout}
                disabled={processing}
                className="w-full bg-secondary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {processing ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                </>
                ) : (
                    checkoutButtonText
                )}
            </Button>
        </motion.div>
      )}
      
      {onContinueShopping && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
                onClick={onContinueShopping}
                className={`w-full mt-3 border border-primary text-primary hover:bg-primary hover:text-white ${!showCheckoutButton ? 'mt-0' : ''}`}
            >
                {continueShoppingButtonText}
            </Button>
        </motion.div>
      )}

      {showSecurityBadges && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="Shield" className="w-4 h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Lock" className="w-4 h-4" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderSummaryBox;