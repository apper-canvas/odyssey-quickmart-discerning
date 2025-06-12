import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';

const PaymentDetailsForm = ({ paymentInfo, setPaymentInfo, formatCardNumber }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="credit"
              checked={paymentInfo.method === 'credit'}
              onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value})}
              className="mr-3"
            />
            <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
            <span>Credit Card</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="paypal"
              checked={paymentInfo.method === 'paypal'}
              onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value})}
              className="mr-3"
            />
            <ApperIcon name="Wallet" className="w-5 h-5 mr-2" />
            <span>PayPal</span>
          </label>
        </div>
      </div>

      {paymentInfo.method === 'credit' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Card Number"
            id="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            required
            className="md:col-span-2"
          />
          
          <FormField
            label="Expiry Date"
            id="expiryDate"
            value={paymentInfo.expiryDate}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
              }
              setPaymentInfo({...paymentInfo, expiryDate: value});
            }}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
          
          <FormField
            label="CVV"
            id="cvv"
            type="text" // Keep as text, input pattern regex handles digits
            value={paymentInfo.cvv}
            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value.replace(/\D/g, '')})}
            placeholder="123"
            maxLength={3}
            required
          />
          
          <FormField
            label="Name on Card"
            id="cardName"
            value={paymentInfo.cardName}
            onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
            placeholder="John Doe"
            required
            className="md:col-span-2"
          />
        </div>
      )}

      {paymentInfo.method === 'paypal' && (
        <div className="text-center py-8">
          <ApperIcon name="Wallet" className="w-16 h-16 text-info mx-auto mb-4" />
          <p className="text-gray-600">You will be redirected to PayPal to complete your payment.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsForm;