import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';

const AddIncomeCategoryForm = ({ onCancel }) => {
  const { addIncomeCategory } = useBudget();
  const [formData, setFormData] = useState({
    name: '',
    color: '#27ae60'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.color) {
      alert('Please fill in all fields');
      return;
    }

    addIncomeCategory({
      name: formData.name,
      color: formData.color
    });

    setFormData({
      name: '',
      color: '#27ae60'
    });
    
    if (onCancel) onCancel();
  };

  const colorPresets = [
    '#27ae60', // Green
    '#2980b9', // Blue
    '#8e44ad', // Purple
    '#d35400', // Orange
    '#c0392b', // Red
    '#16a085', // Teal
    '#f39c12', // Yellow
    '#7f8c8d'  // Gray
  ];

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Income Category</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Side Business"
            required
          />
        </div>
        
        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Category Color</label>
          <div className="flex items-center mb-2">
            <input
              type="color"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="h-8 w-8 border-0 p-0"
            />
            <span className="ml-2 text-sm text-gray-500">{formData.color}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {colorPresets.map(color => (
              <button
                key={color}
                type="button"
                className="h-6 w-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: color }}
                onClick={() => setFormData({ ...formData, color })}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIncomeCategoryForm;