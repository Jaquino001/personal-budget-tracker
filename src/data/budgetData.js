// Default budget data structure
export const defaultBudgetData = {
  categories: [
    { id: 1, name: 'Housing', budget: 1000, actual: 950, color: '#3498db' },
    { id: 2, name: 'Food', budget: 500, actual: 470, color: '#2ecc71' },
    { id: 3, name: 'Transportation', budget: 300, actual: 250, color: '#e74c3c' },
    { id: 4, name: 'Entertainment', budget: 200, actual: 180, color: '#f39c12' },
    { id: 5, name: 'Utilities', budget: 250, actual: 245, color: '#9b59b6' },
    { id: 6, name: 'Healthcare', budget: 150, actual: 100, color: '#1abc9c' },
    { id: 7, name: 'Personal', budget: 200, actual: 210, color: '#e67e22' }
  ],
  incomeCategories: [
    { id: 1, name: 'Salary', color: '#27ae60' },
    { id: 2, name: 'Freelance', color: '#2980b9' },
    { id: 3, name: 'Investments', color: '#8e44ad' },
    { id: 4, name: 'Gifts', color: '#d35400' },
    { id: 5, name: 'Other', color: '#16a085' }
  ],
  transactions: [
    { id: 1, date: '2025-07-01', category: 'Housing', amount: 950, description: 'Monthly rent' },
    { id: 2, date: '2025-07-02', category: 'Food', amount: 85, description: 'Grocery shopping' },
    { id: 3, date: '2025-07-03', category: 'Transportation', amount: 45, description: 'Gas' },
    { id: 4, date: '2025-07-05', category: 'Food', amount: 65, description: 'Restaurant' },
    { id: 5, date: '2025-07-07', category: 'Utilities', amount: 120, description: 'Electricity bill' },
    { id: 6, date: '2025-07-08', category: 'Entertainment', amount: 50, description: 'Movie night' },
    { id: 7, date: '2025-07-10', category: 'Healthcare', amount: 100, description: 'Doctor visit' },
    { id: 8, date: '2025-07-12', category: 'Food', amount: 95, description: 'Grocery shopping' },
    { id: 9, date: '2025-07-15', category: 'Transportation', amount: 50, description: 'Gas' },
    { id: 10, date: '2025-07-18', category: 'Food', amount: 75, description: 'Restaurant' },
    { id: 11, date: '2025-07-20', category: 'Utilities', amount: 125, description: 'Water bill' },
    { id: 12, date: '2025-07-22', category: 'Entertainment', amount: 40, description: 'Streaming subscription' },
    { id: 13, date: '2025-07-25', category: 'Personal', amount: 110, description: 'Clothing' },
    { id: 14, date: '2025-07-28', category: 'Food', amount: 150, description: 'Grocery shopping' },
    { id: 15, date: '2025-07-30', category: 'Personal', amount: 100, description: 'Haircut' },
  ],
  incomes: [
    { id: 1, date: '2025-07-01', category: 'Salary', amount: 3500, description: 'Monthly salary' },
    { id: 2, date: '2025-07-10', category: 'Freelance', amount: 500, description: 'Website project' },
    { id: 3, date: '2025-07-15', category: 'Investments', amount: 150, description: 'Dividend payment' },
    { id: 4, date: '2025-07-20', category: 'Other', amount: 50, description: 'Refund' },
  ],
  creditCards: [
    { id: 1, name: 'Chase Freedom', limit: 5000, balance: 1500, color: '#3498db' },
    { id: 2, name: 'American Express', limit: 10000, balance: 2500, color: '#2ecc71' },
  ],
  monthlySummary: [
    { month: 'Jan', income: 4000, expenses: 3000 },
    { month: 'Feb', income: 4200, expenses: 3100 },
    { month: 'Mar', income: 3800, expenses: 2800 },
    { month: 'Apr', income: 4100, expenses: 3300 },
    { month: 'May', income: 4300, expenses: 3200 },
    { month: 'Jun', income: 4150, expenses: 3150 },
    { month: 'Jul', income: 4200, expenses: 3400 },
  ],
  totalBudget: 2600,
  totalExpenses: 2405,
  totalIncome: 4200,
  income: 4200,
};

// LocalStorage keys
export const BUDGET_STORAGE_KEY = 'personal_budget_data';

// Load data from localStorage
export const loadBudgetData = () => {
  try {
    const savedData = localStorage.getItem(BUDGET_STORAGE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return defaultBudgetData;
  } catch (error) {
    console.error('Error loading budget data:', error);
    return defaultBudgetData;
  }
};

// Save data to localStorage
export const saveBudgetData = (data) => {
  try {
    localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving budget data:', error);
    return false;
  }
};