import React from 'react';
import { useBudget } from '../context/BudgetContext';
import { generateBudgetPDF } from '../utils/pdfGenerator';

function Header() {
  const { budgetData, isLoading, resetData } = useBudget();
  
  const handleDownloadPDF = () => {
    generateBudgetPDF(budgetData);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data to default values? This cannot be undone.')) {
      resetData();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Personal Budget Manager</h1>
            <p className="text-gray-500 text-sm">Track, manage, and analyze your personal finances</p>
          </div>
          
          <div className="flex gap-3">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              onClick={handleDownloadPDF}
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              onClick={handleResetData}
              disabled={isLoading}
            >
              Reset Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;