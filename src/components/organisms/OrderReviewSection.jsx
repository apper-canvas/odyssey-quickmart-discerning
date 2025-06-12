import React from 'react';
import CartItemCard from '@/components/molecules/CartItemCard'; // Reusing for item display, though it has quantity controls
import { AnimatePresence } from 'framer-motion';

const OrderReviewSection = ({ shippingInfo, paymentInfo, cartItems, products, formatPrice }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
      
      {/* Shipping Address */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p>{shippingInfo.street}</p>
          <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
          <p>{shippingInfo.country}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          {paymentInfo.method === 'credit' ? (
            <p>Credit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
          ) : (
            <p>PayPal</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
        <div className="space-y-3">
          <AnimatePresence>
            {cartItems.map((item) => {
              const product = products[item.productId];
              if (!product) return null;

              return (
                <div key={item.productId} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 break-words">{product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewSection;