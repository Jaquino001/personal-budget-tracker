import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateBudgetPDF = (budgetData) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text('Personal Budget Summary', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  // Add overall budget summary
  doc.setFontSize(16);
  doc.text('Budget Overview', 14, 45);
  doc.setFontSize(12);
  doc.setTextColor(70, 70, 70);
  doc.text(`Total Budget: $${budgetData.totalBudget.toFixed(2)}`, 14, 55);
  doc.text(`Total Expenses: $${budgetData.totalExpenses.toFixed(2)}`, 14, 62);
  doc.text(`Remaining: $${(budgetData.totalBudget - budgetData.totalExpenses).toFixed(2)}`, 14, 69);
  doc.text(`Income: $${budgetData.income.toFixed(2)}`, 14, 76);
  doc.text(`Savings: $${(budgetData.income - budgetData.totalExpenses).toFixed(2)}`, 14, 83);

  // Add categories table
  doc.setFontSize(16);
  doc.setTextColor(40, 40, 40);
  doc.text('Budget Categories', 14, 100);
  
  const categoryColumns = ['Category', 'Budget', 'Actual', 'Remaining'];
  const categoryData = budgetData.categories.map(cat => [
    cat.name,
    `$${cat.budget.toFixed(2)}`,
    `$${cat.actual.toFixed(2)}`,
    `$${(cat.budget - cat.actual).toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: 105,
    head: [categoryColumns],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [52, 152, 219] }
  });
  
  // Add credit cards table
  const finalY = doc.lastAutoTable.finalY || 105;
  doc.setFontSize(16);
  doc.text('Credit Cards', 14, finalY + 15);
  
  const cardColumns = ['Card Name', 'Credit Limit', 'Current Balance', 'Available Credit'];
  const cardData = budgetData.creditCards.map(card => [
    card.name,
    `$${card.limit.toFixed(2)}`,
    `$${card.balance.toFixed(2)}`,
    `$${(card.limit - card.balance).toFixed(2)}`
  ]);
  
  doc.autoTable({
    startY: finalY + 20,
    head: [cardColumns],
    body: cardData,
    theme: 'striped',
    headStyles: { fillColor: [46, 204, 113] }
  });
  
  // Add recent transactions table
  const cardFinalY = doc.lastAutoTable.finalY || (finalY + 20);
  doc.setFontSize(16);
  doc.text('Recent Transactions (Last 5)', 14, cardFinalY + 15);
  
  const transactionColumns = ['Date', 'Category', 'Amount', 'Description'];
  const recentTransactions = [...budgetData.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
    
  const transactionData = recentTransactions.map(t => [
    t.date,
    t.category,
    `$${parseFloat(t.amount).toFixed(2)}`,
    t.description
  ]);
  
  doc.autoTable({
    startY: cardFinalY + 20,
    head: [transactionColumns],
    body: transactionData,
    theme: 'striped',
    headStyles: { fillColor: [231, 76, 60] }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Personal Budget Manager - Page ' + i + ' of ' + pageCount, 105, 290, { align: 'center' });
  }
  
  // Save the PDF
  doc.save('budget-summary.pdf');
};