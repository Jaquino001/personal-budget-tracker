import React from 'react';
import { useBudget } from '../context/BudgetContext';

function BudgetSuggestions() {
  const { budgetData } = useBudget();

  if (!budgetData) return null;

  const generateSuggestions = () => {
    const suggestions = [];
    const { totalBudget, totalExpenses, income, categories, creditCards } = budgetData;
    
    // Overall budget health
    const remainingBudget = totalBudget - totalExpenses;
    const savingsAmount = income - totalExpenses;
    const savingsRate = (savingsAmount / income) * 100;
    
    // Check overall budget status
    if (remainingBudget < 0) {
      suggestions.push({
        type: 'danger',
        title: 'You are over budget',
        message: `You've exceeded your budget by $${Math.abs(remainingBudget).toFixed(2)}. Consider reviewing your expenses and adjusting your budget.`,
      });
    } else if (remainingBudget < totalBudget * 0.1) {
      suggestions.push({
        type: 'warning',
        title: 'Budget nearly depleted',
        message: `You have only $${remainingBudget.toFixed(2)} remaining (${((remainingBudget / totalBudget) * 100).toFixed(1)}% of budget). Consider limiting non-essential spending.`,
      });
    }
    
    // Savings rate suggestions
    if (savingsRate < 10) {
      suggestions.push({
        type: 'warning',
        title: 'Low savings rate',
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Financial experts typically recommend saving at least 20% of your income.`,
      });
    } else if (savingsRate >= 20) {
      suggestions.push({
        type: 'success',
        title: 'Healthy savings rate',
        message: `Great job! You're saving ${savingsRate.toFixed(1)}% of your income, which meets or exceeds the recommended 20% savings rate.`,
      });
    }
    
    // Category specific analysis
    categories.forEach(category => {
      const categoryBudget = category.budget;
      const categoryExpenses = category.actual;
      const remainingCategoryBudget = categoryBudget - categoryExpenses;
      
      // If category is over budget by more than 10%
      if (remainingCategoryBudget < 0 && Math.abs(remainingCategoryBudget) > categoryBudget * 0.1) {
        suggestions.push({
          type: 'danger',
          title: `${category.name} budget exceeded`,
          message: `You've exceeded your ${category.name} budget by $${Math.abs(remainingCategoryBudget).toFixed(2)} (${((Math.abs(remainingCategoryBudget) / categoryBudget) * 100).toFixed(1)}% over). Look for ways to reduce spending in this category.`,
        });
      }
      
      // If a category has spent less than 50% with only a week left (assuming monthly budgeting)
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const dayOfMonth = today.getDate();
      
      if (categoryExpenses < categoryBudget * 0.5 && dayOfMonth > daysInMonth - 7) {
        suggestions.push({
          type: 'info',
          title: `${category.name} budget underutilized`,
          message: `You've used only ${((categoryExpenses / categoryBudget) * 100).toFixed(1)}% of your ${category.name} budget. Consider reallocating these funds or saving the excess.`,
        });
      }
    });
    
    // Credit card utilization suggestions
    creditCards.forEach(card => {
      const utilization = card.balance / card.limit;
      
      if (utilization > 0.3) {
        const severity = utilization > 0.7 ? 'danger' : 'warning';
        suggestions.push({
          type: severity,
          title: `High utilization on ${card.name}`,
          message: `Your credit utilization on ${card.name} is ${(utilization * 100).toFixed(1)}%. For optimal credit health, aim to keep utilization below 30%.`,
        });
      }
    });
    
    // Check if income is fully allocated
    const totalBudgetToIncomeRatio = totalBudget / income;
    if (totalBudgetToIncomeRatio < 0.7) {
      suggestions.push({
        type: 'info',
        title: 'Income not fully budgeted',
        message: `Only ${(totalBudgetToIncomeRatio * 100).toFixed(1)}% of your income is allocated in your budget. Consider budgeting the remaining ${((1 - totalBudgetToIncomeRatio) * 100).toFixed(1)}% for savings or investments.`,
      });
    }
    
    return suggestions;
  };

  const suggestions = generateSuggestions();
  
  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'danger':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getSuggestionStyles = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Suggestions</h2>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">No suggestions available at this time. Your budget is looking good!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Suggestions</h2>
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div 
            key={index} 
            className={`flex p-4 border rounded-lg ${getSuggestionStyles(suggestion.type)}`}
          >
            {getSuggestionIcon(suggestion.type)}
            <div className="ml-4 flex-grow">
              <h3 className="font-semibold">{suggestion.title}</h3>
              <p className="text-sm text-gray-600">{suggestion.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetSuggestions;