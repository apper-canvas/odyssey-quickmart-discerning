import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const OrderStatusTimeline = ({ order }) => {
  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: 'ShoppingBag' },
      { status: 'processing', label: 'Processing', icon: 'Package' },
      { status: 'shipped', label: 'Shipped', icon: 'Truck' },
      { status: 'delivered', label: 'Delivered', icon: 'CheckCircle' }
    ];

    const currentIndex = steps.findIndex(step => step.status === order?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const statusSteps = getStatusSteps();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
      
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
        <div 
          className="absolute left-6 top-6 w-0.5 bg-primary transition-all duration-1000"
          style={{ height: `${(statusSteps.findIndex(s => s.current) + 1) * 25}%` }}
        ></div>
        
        {/* Status Steps */}
        <div className="space-y-8">
          {statusSteps.map((step, index) => (
            <div key={step.status} className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                step.completed 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                <ApperIcon name={step.icon} className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-medium ${
                  step.completed ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </h3>
                
                {/* Timeline Entry */}
                {order.timeline && order.timeline.find(t => t.status === step.status) && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-600">
                      {order.timeline.find(t => t.status === step.status).description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(
                        new Date(order.timeline.find(t => t.status === step.status).timestamp), 
                        'MMM dd, yyyy at h:mm a'
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OrderStatusTimeline;