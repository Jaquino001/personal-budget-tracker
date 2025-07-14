import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';

function AddCreditCardForm({ onCancel }) {
  const { addCreditCard } = useBudget();
  const [formData, setFormData] = useState({
    name: '',
    limit: '',
    balance: '',
    color: '#3498db'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Card name is required';
    }
    
    if (!formData.limit || parseFloat(formData.limit) <= 0) {
      newErrors.limit = 'Credit limit must be greater than zero';
    }
    
    if (!formData.balance && formData.balance !== '0') {
      newErrors.balance = 'Current balance is required';
    } else if (parseFloat(formData.balance) < 0) {
      newErrors.balance = 'Balance cannot be negative';
    } else if (parseFloat(formData.balance) > parseFloat(formData.limit)) {
      newErrors.balance = 'Balance cannot exceed limit';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addCreditCard({
        name: formData.name,
        limit: parseFloat(formData.limit),
        balance: parseFloat(formData.balance),
        color: formData.color
      });
      
      onCancel(); // Close the form
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Credit Card</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="e.g. Chase Freedom"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit ($)</label>
            <input
              type="number"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              className={`w-full border ${errors.limit ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="5000"
              step="0.01"
            />
            {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance ($)</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className={`w-full border ${errors.balance ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="0"
              step="0.01"
            />
            {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full h-10 p-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Card
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCreditCardForm;