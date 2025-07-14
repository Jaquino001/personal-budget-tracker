import React from 'react';
import { useBudget } from '../context/BudgetContext';

const IncomeList = ({ limit }) => {
  const { budgetData, deleteIncome } = useBudget();
  
  if (!budgetData || !budgetData.incomes) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Income</h2>
        <p className="text-gray-500">No income data available</p>
      </div>
    );
  }
  
  // Sort incomes by date (most recent first)
  const sortedIncomes = [...budgetData.incomes].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  
  // Limit the number of incomes displayed if specified
  const displayIncomes = limit ? sortedIncomes.slice(0, limit) : sortedIncomes;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Recent Income</h2>
      </div>
      
      {displayIncomes.length === 0 ? (
        <div className="p-6">
          <p className="text-gray-500">No income transactions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayIncomes.map((income) => {
                // Find the category color
                const category = budgetData.incomeCategories.find(
                  cat => cat.name === income.category
                );
                const categoryColor = category ? category.color : '#cccccc';
                
                return (
                  <tr key={income.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {income.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{ 
                          backgroundColor: `${categoryColor}20`, 
                          color: categoryColor 
                        }}
                      >
                        {income.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      ${parseFloat(income.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => deleteIncome(income.id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncomeList;