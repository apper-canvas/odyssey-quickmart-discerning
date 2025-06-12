import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ label, type = 'text', id, value, onChange, placeholder, options, required, className, ...props }) => {
  const InputComponent = type === 'select' ? Select : Input;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      {type === 'select' ? (
        <InputComponent id={id} value={value} onChange={onChange} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </InputComponent>
      ) : (
        <InputComponent
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      )}
    </div>
  );
};

export default FormField;