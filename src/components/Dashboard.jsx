import React, { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import BudgetChart from './charts/BudgetChart';
import ExpenseChart from './charts/ExpenseChart';
import IncomeExpenseChart from './charts/IncomeExpenseChart';
import BudgetTrendsChart from './charts/BudgetTrendsChart';
import StatsCard from './StatsCard';
import CreditCardSection from './CreditCardSection';
import TransactionList from './TransactionList';
import IncomeList from './IncomeList';
import AddTransactionForm from './AddTransactionForm';
import AddIncomeForm from './AddIncomeForm';
import AddCategoryForm from './AddCategoryForm';
import AddIncomeCategoryForm from './AddIncomeCategoryForm';
import BudgetSuggestions from './BudgetSuggestions';

function Dashboard() {
  const { budgetData, isLoading } = useBudget();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddIncomeCategory, setShowAddIncomeCategory] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-200 h-40 rounded-lg"></div>
          <div className="bg-gray-200 h-40 rounded-lg"></div>
          <div className="bg-gray-200 h-40 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-200 h-72 rounded-lg"></div>
          <div className="bg-gray-200 h-72 rounded-lg"></div>
        </div>
        <div className="bg-gray-200 h-80 rounded-lg"></div>
      </div>
    );
  }

  // Calculate statistics
  const totalBudget = budgetData.totalBudget;
  const totalExpenses = budgetData.totalExpenses;
  const totalIncome = budgetData.totalIncome || budgetData.income;
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUsedPercentage = (totalExpenses / totalBudget) * 100;
  const netSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
  
  const mostExpensiveCategory = [...budgetData.categories].sort((a, b) => b.actual - a.actual)[0];
  
  // Navigation tabs
  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'expenses', name: 'Expenses' },
    { id: 'income', name: 'Income' },
    { id: 'trends', name: 'Trends' }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
      
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Budget Used"
              value={`${budgetUsedPercentage.toFixed(1)}%`}
              description={`$${totalExpenses.toFixed(2)} of $${totalBudget.toFixed(2)}`}
              color={budgetUsedPercentage > 90 ? 'red' : budgetUsedPercentage > 75 ? 'yellow' : 'green'}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <StatsCard 
              title="Total Income"
              value={`$${totalIncome.toFixed(2)}`}
              description="Monthly income"
              color="green"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard 
              title="Savings Rate"
              value={`${savingsRate.toFixed(1)}%`}
              description={`$${netSavings.toFixed(2)} saved this month`}
              color={savingsRate >= 20 ? 'green' : savingsRate >= 10 ? 'yellow' : 'red'}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>

          {/* Budget Suggestions Section */}
          <BudgetSuggestions />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Budget Overview</h2>
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  {showAddCategory ? 'Cancel' : 'Add Category'}
                </button>
              </div>
              {showAddCategory ? (
                <AddCategoryForm onCancel={() => setShowAddCategory(false)} />
              ) : (
                <div className="h-72">
                  <BudgetChart categories={budgetData.categories} />
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Income vs. Expenses</h2>
              <div className="h-72">
                <IncomeExpenseChart data={budgetData.monthlySummary} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CreditCardSection creditCards={budgetData.creditCards} />
            <BudgetTrendsChart />
          </div>
        </>
      )}
      
      {activeTab === 'expenses' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Expenses"
              value={`$${totalExpenses.toFixed(2)}`}
              description="Current month"
              color="red"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatsCard 
              title="Top Expense"
              value={mostExpensiveCategory.name}
              description={`$${mostExpensiveCategory.actual.toFixed(2)}`}
              color="blue"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <StatsCard 
              title="Budget Used"
              value={`${budgetUsedPercentage.toFixed(1)}%`}
              description={`$${totalExpenses.toFixed(2)} of $${totalBudget.toFixed(2)}`}
              color={budgetUsedPercentage > 90 ? 'red' : budgetUsedPercentage > 75 ? 'yellow' : 'green'}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Expense Categories</h2>
                <button 
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                >
                  {showAddCategory ? 'Cancel' : 'Add Category'}
                </button>
              </div>
              {showAddCategory ? (
                <AddCategoryForm onCancel={() => setShowAddCategory(false)} />
              ) : (
                <div className="h-72">
                  <BudgetChart categories={budgetData.categories} />
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Distribution</h2>
              <div className="h-72">
                <ExpenseChart categories={budgetData.categories} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => setShowAddTransaction(!showAddTransaction)}
                >
                  {showAddTransaction ? 'Cancel' : 'Add Transaction'}
                </button>
              </div>
              {showAddTransaction && (
                <div className="mt-4">
                  <AddTransactionForm categories={budgetData.categories} onCancel={() => setShowAddTransaction(false)} />
                </div>
              )}
            </div>
            <TransactionList transactions={budgetData.transactions} categories={budgetData.categories} />
          </div>
        </>
      )}
      
      {activeTab === 'income' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard 
              title="Total Income"
              value={`$${totalIncome.toFixed(2)}`}
              description="Current month"
              color="green"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard 
              title="Net Savings"
              value={`$${netSavings.toFixed(2)}`}
              description={savingsRate >= 0 ? `${savingsRate.toFixed(1)}% saved` : 'Negative savings'}
              color={netSavings >= 0 ? 'green' : 'red'}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatsCard 
              title="Income Sources"
              value={budgetData.incomeCategories?.length || 0}
              description="Active income sources"
              color="blue"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">Add Income</h2>
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    onClick={() => setShowAddIncome(!showAddIncome)}
                  >
                    {showAddIncome ? 'Cancel' : 'Add Income'}
                  </button>
                </div>
                {showAddIncome && (
                  <div className="mt-4">
                    <AddIncomeForm onCancel={() => setShowAddIncome(false)} />
                  </div>
                )}
              </div>
              {!showAddIncome && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Income Categories</h3>
                    <button 
                      className="text-green-500 hover:text-green-700"
                      onClick={() => setShowAddIncomeCategory(!showAddIncomeCategory)}
                    >
                      {showAddIncomeCategory ? 'Cancel' : 'Add Category'}
                    </button>
                  </div>
                  {showAddIncomeCategory ? (
                    <AddIncomeCategoryForm onCancel={() => setShowAddIncomeCategory(false)} />
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {budgetData.incomeCategories?.map(category => (
                        <div 
                          key={category.id}
                          className="flex items-center p-3 rounded-md"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Income vs. Expenses</h2>
              <div className="h-72">
                <IncomeExpenseChart data={budgetData.monthlySummary} />
              </div>
            </div>
          </div>

          <IncomeList />
        </>
      )}
      
      {activeTab === 'trends' && (
        <>
          <div className="grid grid-cols-1 gap-6">
            <BudgetTrendsChart />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Income vs. Expenses</h2>
                <div className="h-72">
                  <IncomeExpenseChart data={budgetData.monthlySummary} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Distribution</h2>
                <div className="h-72">
                  <ExpenseChart categories={budgetData.categories} />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Performance</h2>
              <div className="h-72">
                <BudgetChart categories={budgetData.categories} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;