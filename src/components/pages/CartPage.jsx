import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CartOverview from '@/components/organisms/CartOverview';
import OrderSummaryBox from '@/components/organisms/OrderSummaryBox';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';

import { cartService, productService } from '@/services';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const cart = await cartService.getCart();
      setCartItems(cart);
      
      const productPromises = cart.map(item => 
        productService.getById(item.productId).catch(() => null)
      );
      const productData = await Promise.all(productPromises);
      
      const productMap = {};
      productData.forEach(product => {
        if (product) {
          productMap[product.id] = product;
        }
      });
      setProducts(productMap);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const updatedCart = await cartService.updateQuantity(productId, newQuantity);
      setCartItems(updatedCart);
      toast.success('Cart updated');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedCart = await cartService.removeItem(productId);
      setCartItems(updatedCart);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08;
  };

  const calculateShipping = (subtotal) => {
    return subtotal > 50 ? 0 : 9.99;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = calculateShipping(subtotal);
    return subtotal + tax + shipping;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SkeletonLoader count={3} itemClassName="p-4">
                <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
              </SkeletonLoader>
            </div>
            <div className="bg-surface rounded-lg p-6 shadow-sm h-fit">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
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
          <ErrorState message={error} onRetry={loadCart} />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <EmptyState
            icon="ShoppingCart"
            title="Your cart is empty"
            message="Add some products to get started"
            actionText="Start Shopping"
            onActionClick={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartOverview
            cartItems={cartItems}
            products={products}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            clearCart={clearCart}
            formatPrice={formatPrice}
          />

          <div className="lg:col-span-1">
            <OrderSummaryBox
              subtotal={calculateSubtotal()}
              tax={calculateTax(calculateSubtotal())}
              shipping={calculateShipping(calculateSubtotal())}
              total={calculateTotal()}
              formatPrice={formatPrice}
              onProceedToCheckout={() => navigate('/checkout')}
              onContinueShopping={() => navigate('/')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;