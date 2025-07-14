import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';

function AddCategoryForm({ onCancel }) {
  const { addCategory } = useBudget();
  const [formData, setFormData] = useState({
    name: '',
    budget: '',
    actual: '0',
    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
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
      newErrors.name = 'Category name is required';
    }
    
    if (!formData.budget || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      addCategory({
        name: formData.name,
        budget: parseFloat(formData.budget),
        actual: parseFloat(formData.actual || 0),
        color: formData.color
      });
      
      onCancel(); // Close the form
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Budget Category</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            placeholder="e.g. Groceries"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Amount ($)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className={`w-full border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              placeholder="0.00"
              step="0.01"
            />
            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Spending ($)</label>
            <input
              type="number"
              name="actual"
              value={formData.actual}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Color</label>
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
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategoryForm;