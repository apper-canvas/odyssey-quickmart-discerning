import React from 'react';
import CheckoutForm from '@/components/organisms/CheckoutForm';

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <CheckoutForm />
      </div>
    </div>
  );
};

export default CheckoutPage;