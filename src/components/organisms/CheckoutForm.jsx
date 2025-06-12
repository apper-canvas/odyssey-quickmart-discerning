import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import ProgressSteps from '@/components/molecules/ProgressSteps';
import ShippingAddressForm from '@/components/organisms/ShippingAddressForm';
import PaymentDetailsForm from '@/components/organisms/PaymentDetailsForm';
import OrderReviewSection from '@/components/organisms/OrderReviewSection';
import OrderSummaryBox from '@/components/organisms/OrderSummaryBox';
import Button from '@/components/atoms/Button';

import { cartService, productService, orderService } from '@/services';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cart = await cartService.getCart();
      if (cart.length === 0) {
        toast.info('Your cart is empty. Please add items before checking out.');
        navigate('/cart');
        return;
      }
      
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
    } catch (error) {
      toast.error('Failed to load cart');
      navigate('/cart');
    } finally {
      setLoading(false);
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

  const validateShipping = () => {
    const required = ['street', 'city', 'state', 'zipCode'];
    const missing = required.filter(field => !shippingInfo[field].trim());
    
    if (missing.length > 0) {
      toast.error('Please fill in all required shipping fields');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentInfo.method === 'credit') {
      const required = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      const missing = required.filter(field => !paymentInfo[field].trim());
      
      if (missing.length > 0) {
        toast.error('Please fill in all required payment fields');
        return false;
      }
      
      const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardNumber)) {
        toast.error('Please enter a valid 16-digit card number');
        return false;
      }
      
      if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        toast.error('Please enter expiry date in MM/YY format');
        return false;
      }
      
      if (!/^\d{3}$/.test(paymentInfo.cvv)) {
        toast.error('Please enter a valid 3-digit CVV');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateShipping()) return;
    if (currentStep === 2 && !validatePayment()) return;
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    
    setProcessing(true);
    try {
      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        shippingAddress: shippingInfo,
        paymentMethod: paymentInfo.method === 'credit' 
          ? `Credit Card ending in ${paymentInfo.cardNumber.slice(-4)}`
          : 'PayPal'
      };
      
      const order = await orderService.create(orderData);
      await cartService.clearCart();
      
      toast.success('Order placed successfully!');
      navigate(`/order/${order.id}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const steps = [
    { id: 1, title: 'Shipping', icon: 'Truck' },
    { id: 2, title: 'Payment', icon: 'CreditCard' },
    { id: 3, title: 'Review', icon: 'CheckCircle' }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
          <div className="h-60 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-primary mb-4">Checkout</h1>
        <ProgressSteps steps={steps} currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-surface rounded-lg p-6 shadow-sm"
          >
            {currentStep === 1 && (
              <ShippingAddressForm
                shippingInfo={shippingInfo}
                setShippingInfo={setShippingInfo}
              />
            )}

            {currentStep === 2 && (
              <PaymentDetailsForm
                paymentInfo={paymentInfo}
                setPaymentInfo={setPaymentInfo}
                formatCardNumber={formatCardNumber}
              />
            )}

            {currentStep === 3 && (
              <OrderReviewSection
                shippingInfo={shippingInfo}
                paymentInfo={paymentInfo}
                cartItems={cartItems}
                products={products}
                formatPrice={formatPrice}
              />
            )}

            <div className="flex justify-between mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={currentStep === 1 ? () => navigate('/cart') : handlePreviousStep}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {currentStep === 1 ? 'Back to Cart' : 'Previous'}
                </Button>
              </motion.div>
              
              {currentStep < 3 ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleNextStep}
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        Continue
                    </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handlePlaceOrder}
                        disabled={processing}
                        className="bg-secondary text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {processing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                        </>
                        ) : (
                        'Place Order'
                        )}
                    </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryBox
            subtotal={calculateSubtotal()}
            tax={calculateTax(calculateSubtotal())}
            shipping={calculateShipping(calculateSubtotal())}
            total={calculateTotal()}
            formatPrice={formatPrice}
            showCheckoutButton={false} // Checkout button is handled by CheckoutForm
            showSecurityBadges={true}
          />
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;