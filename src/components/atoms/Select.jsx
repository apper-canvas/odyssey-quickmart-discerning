import React from 'react';

const Select = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;