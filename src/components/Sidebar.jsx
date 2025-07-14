import React from 'react';
import { useBudget } from '../context/BudgetContext';

function Sidebar() {
  const { budgetData, isLoading } = useBudget();

  if (isLoading) {
    return (
      <div className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <div className="flex items-center mb-8">
          <div className="animate-pulse bg-gray-600 h-10 w-10 rounded-full mr-3"></div>
          <div className="animate-pulse bg-gray-600 h-6 w-32 rounded"></div>
        </div>
        
        <div className="space-y-6">
          <div className="animate-pulse bg-gray-600 h-10 w-full rounded"></div>
          <div className="animate-pulse bg-gray-600 h-10 w-full rounded"></div>
          <div className="animate-pulse bg-gray-600 h-10 w-full rounded"></div>
          <div className="animate-pulse bg-gray-600 h-10 w-full rounded"></div>
        </div>
      </div>
    );
  }

  const remainingBudget = budgetData.totalBudget - budgetData.totalExpenses;
  const savingsAmount = budgetData.income - budgetData.totalExpenses;

  return (
    <div className="w-64 bg-gray-800 text-white p-6 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="bg-blue-500 h-10 w-10 rounded-full flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-bold text-lg">Budget App</span>
      </div>
      
      <div className="space-y-6 flex-grow">
        <div className="bg-gray-700 rounded p-3">
          <p className="text-sm text-gray-400">Total Budget</p>
          <p className="text-xl font-bold">${budgetData.totalBudget.toFixed(2)}</p>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <p className="text-sm text-gray-400">Total Expenses</p>
          <p className="text-xl font-bold">${budgetData.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className={`rounded p-3 ${remainingBudget >= 0 ? 'bg-green-800' : 'bg-red-800'}`}>
          <p className="text-sm text-gray-300">Remaining</p>
          <p className="text-xl font-bold">${remainingBudget.toFixed(2)}</p>
        </div>
        
        <div className="bg-gray-700 rounded p-3">
          <p className="text-sm text-gray-400">Monthly Income</p>
          <p className="text-xl font-bold">${budgetData.income.toFixed(2)}</p>
        </div>
        
        <div className={`rounded p-3 ${savingsAmount >= 0 ? 'bg-blue-800' : 'bg-red-800'}`}>
          <p className="text-sm text-gray-300">Savings</p>
          <p className="text-xl font-bold">${savingsAmount.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mt-6 text-center">
        <p>Personal Budget Manager</p>
        <p>Data saved locally</p>
      </div>
    </div>
  );
}

export default Sidebar;