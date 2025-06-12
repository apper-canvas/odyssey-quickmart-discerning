import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center space-x-4 md:space-x-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            currentStep >= step.id
              ? 'bg-primary border-primary text-white'
              : 'bg-white border-gray-300 text-gray-500'
          }`}>
            <ApperIcon name={step.icon} className="w-5 h-5" />
          </div>
          <span className={`ml-2 text-sm font-medium ${
            currentStep >= step.id ? 'text-primary' : 'text-gray-500'
          }`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 ml-4 ${
              currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;