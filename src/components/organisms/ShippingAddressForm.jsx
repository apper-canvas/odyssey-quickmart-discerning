import React from 'react';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';

const ShippingAddressForm = ({ shippingInfo, setShippingInfo }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Street Address"
          id="street"
          value={shippingInfo.street}
          onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
          placeholder="123 Main Street"
          required
          className="md:col-span-2"
        />
        
        <FormField
          label="City"
          id="city"
          value={shippingInfo.city}
          onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
          placeholder="New York"
          required
        />
        
        <FormField
          label="State"
          id="state"
          value={shippingInfo.state}
          onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
          placeholder="NY"
          required
        />
        
        <FormField
          label="ZIP Code"
          id="zipCode"
          value={shippingInfo.zipCode}
          onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
          placeholder="10001"
          required
        />
        
        <FormField
          label="Country"
          id="country"
          type="select"
          value={shippingInfo.country}
          onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
          options={[
            { value: 'USA', label: 'United States' },
            { value: 'CA', label: 'Canada' }
          ]}
        />
      </div>
    </div>
  );
};

export default ShippingAddressForm;