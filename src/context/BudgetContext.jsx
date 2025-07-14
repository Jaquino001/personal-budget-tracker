import React, { createContext, useState, useContext, useEffect } from 'react';
import { loadBudgetData, saveBudgetData, defaultBudgetData } from '../data/budgetData';

const BudgetContext = createContext();

export const useBudget = () => useContext(BudgetContext);

export const BudgetProvider = ({ children }) => {
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on initial render
  useEffect(() => {
    const data = loadBudgetData();
    // Ensure we have income categories and incomes arrays in the loaded data
    const updatedData = {
      ...data,
      incomeCategories: data.incomeCategories || defaultBudgetData.incomeCategories,
      incomes: data.incomes || defaultBudgetData.incomes,
      totalIncome: data.totalIncome || data.income || defaultBudgetData.totalIncome
    };
    setBudgetData(updatedData);
    setIsLoading(false);
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (budgetData && !isLoading) {
      saveBudgetData(budgetData);
    }
  }, [budgetData, isLoading]);

  // Update category
  const updateCategory = (updatedCategory) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    }));
  };

  // Add new category
  const addCategory = (newCategory) => {
    const id = Math.max(...budgetData.categories.map(cat => cat.id), 0) + 1;
    setBudgetData(prev => ({
      ...prev,
      categories: [...prev.categories, { ...newCategory, id }]
    }));
  };

  // Delete category
  const deleteCategory = (id) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat.id !== id)
    }));
  };

  // Add income category
  const addIncomeCategory = (newCategory) => {
    const id = Math.max(...budgetData.incomeCategories.map(cat => cat.id), 0) + 1;
    setBudgetData(prev => ({
      ...prev,
      incomeCategories: [...prev.incomeCategories, { ...newCategory, id }]
    }));
  };

  // Delete income category
  const deleteIncomeCategory = (id) => {
    setBudgetData(prev => ({
      ...prev,
      incomeCategories: prev.incomeCategories.filter(cat => cat.id !== id)
    }));
  };

  // Add transaction
  const addTransaction = (transaction) => {
    const id = Math.max(...budgetData.transactions.map(t => t.id), 0) + 1;
    const newTransaction = { ...transaction, id };
    
    setBudgetData(prev => {
      // Update category actual spending
      const updatedCategories = prev.categories.map(cat => {
        if (cat.name === transaction.category) {
          return { ...cat, actual: cat.actual + parseFloat(transaction.amount) };
        }
        return cat;
      });
      
      // Update total expenses
      const newTotalExpenses = prev.totalExpenses + parseFloat(transaction.amount);
      
      return {
        ...prev,
        categories: updatedCategories,
        transactions: [...prev.transactions, newTransaction],
        totalExpenses: newTotalExpenses
      };
    });
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    const transaction = budgetData.transactions.find(t => t.id === id);
    
    if (transaction) {
      setBudgetData(prev => {
        // Update category actual spending
        const updatedCategories = prev.categories.map(cat => {
          if (cat.name === transaction.category) {
            return { ...cat, actual: cat.actual - parseFloat(transaction.amount) };
          }
          return cat;
        });
        
        // Update total expenses
        const newTotalExpenses = prev.totalExpenses - parseFloat(transaction.amount);
        
        return {
          ...prev,
          categories: updatedCategories,
          transactions: prev.transactions.filter(t => t.id !== id),
          totalExpenses: newTotalExpenses
        };
      });
    }
  };

  // Add income
  const addIncome = (income) => {
    const id = Math.max(...(budgetData.incomes?.map(i => i.id) || [0]), 0) + 1;
    const incomeCategory = budgetData.incomeCategories.find(cat => cat.id === parseInt(income.category));
    const newIncome = { 
      ...income, 
      id,
      category: incomeCategory ? incomeCategory.name : 'Other'
    };
    
    setBudgetData(prev => {
      // Calculate total income
      const totalIncome = (prev.totalIncome || prev.income || 0) + parseFloat(income.amount);
      
      // Update monthly summary if the income is for current month
      const currentDate = new Date();
      const incomeDate = new Date(income.date || new Date());
      
      let updatedMonthlySummary = [...prev.monthlySummary];
      if (incomeDate.getMonth() === currentDate.getMonth() && 
          incomeDate.getFullYear() === currentDate.getFullYear()) {
        const currentMonthIndex = updatedMonthlySummary.length - 1;
        if (currentMonthIndex >= 0) {
          updatedMonthlySummary[currentMonthIndex] = {
            ...updatedMonthlySummary[currentMonthIndex],
            income: updatedMonthlySummary[currentMonthIndex].income + parseFloat(income.amount)
          };
        }
      }
      
      return {
        ...prev,
        incomes: [...(prev.incomes || []), newIncome],
        totalIncome: totalIncome,
        income: totalIncome, // Update legacy income field as well
        monthlySummary: updatedMonthlySummary
      };
    });
  };

  // Delete income
  const deleteIncome = (id) => {
    const income = budgetData.incomes.find(i => i.id === id);
    
    if (income) {
      setBudgetData(prev => {
        const totalIncome = (prev.totalIncome || prev.income || 0) - parseFloat(income.amount);
        
        // Update monthly summary if the income was for current month
        const currentDate = new Date();
        const incomeDate = new Date(income.date || new Date());
        
        let updatedMonthlySummary = [...prev.monthlySummary];
        if (incomeDate.getMonth() === currentDate.getMonth() && 
            incomeDate.getFullYear() === currentDate.getFullYear()) {
          const currentMonthIndex = updatedMonthlySummary.length - 1;
          if (currentMonthIndex >= 0) {
            updatedMonthlySummary[currentMonthIndex] = {
              ...updatedMonthlySummary[currentMonthIndex],
              income: updatedMonthlySummary[currentMonthIndex].income - parseFloat(income.amount)
            };
          }
        }
        
        return {
          ...prev,
          incomes: prev.incomes.filter(i => i.id !== id),
          totalIncome: totalIncome,
          income: totalIncome, // Update legacy income field as well
          monthlySummary: updatedMonthlySummary
        };
      });
    }
  };

  // Add credit card
  const addCreditCard = (card) => {
    const id = Math.max(...budgetData.creditCards.map(c => c.id), 0) + 1;
    setBudgetData(prev => ({
      ...prev,
      creditCards: [...prev.creditCards, { ...card, id }]
    }));
  };

  // Update credit card
  const updateCreditCard = (updatedCard) => {
    setBudgetData(prev => ({
      ...prev,
      creditCards: prev.creditCards.map(card => 
        card.id === updatedCard.id ? updatedCard : card
      )
    }));
  };

  // Delete credit card
  const deleteCreditCard = (id) => {
    setBudgetData(prev => ({
      ...prev,
      creditCards: prev.creditCards.filter(card => card.id !== id)
    }));
  };

  // Update total budget
  const updateTotalBudget = (amount) => {
    setBudgetData(prev => ({
      ...prev,
      totalBudget: amount
    }));
  };

  // Update income
  const updateIncome = (amount) => {
    setBudgetData(prev => ({
      ...prev,
      income: amount,
      totalIncome: amount
    }));
  };

  // Reset data to defaults
  const resetData = () => {
    setBudgetData(defaultBudgetData);
  };

  const value = {
    budgetData,
    isLoading,
    updateCategory,
    addCategory,
    deleteCategory,
    addIncomeCategory,
    deleteIncomeCategory,
    addTransaction,
    deleteTransaction,
    addIncome,
    deleteIncome,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    updateTotalBudget,
    updateIncome,
    resetData
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};