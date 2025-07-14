import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useBudget } from '../../context/BudgetContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BudgetTrendsChart = () => {
  const { budgetData } = useBudget();
  
  if (!budgetData || !budgetData.monthlySummary) {
    return (
      <div className="bg-white rounded-lg shadow p-6 h-72 flex items-center justify-center">
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  const months = budgetData.monthlySummary.map(item => item.month);
  
  // Calculate net values (income - expenses) for each month
  const netValues = budgetData.monthlySummary.map(
    item => item.income - item.expenses
  );
  
  // Calculate cumulative balance over time
  let cumulativeBalance = 0;
  const cumulativeBalances = budgetData.monthlySummary.map(item => {
    cumulativeBalance += (item.income - item.expenses);
    return cumulativeBalance;
  });
  
  // Calculate trends (percentage change month over month)
  const trends = [];
  for (let i = 1; i < netValues.length; i++) {
    const previousMonth = netValues[i-1];
    const currentMonth = netValues[i];
    
    if (previousMonth === 0) {
      trends.push(currentMonth > 0 ? 100 : currentMonth < 0 ? -100 : 0);
    } else {
      trends.push(((currentMonth - previousMonth) / Math.abs(previousMonth)) * 100);
    }
  }
  trends.unshift(0); // No trend for the first month

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Net (Income - Expenses)',
        data: netValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Cumulative Balance',
        data: cumulativeBalances,
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Month-over-Month Trend (%)',
        data: trends,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.1,
        hidden: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Budget Trends Over Time',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (label.includes('Trend')) {
              return `${label}: ${value.toFixed(1)}%`;
            } else if (label.includes('Net') || label.includes('Cumulative')) {
              return `${label}: $${value.toFixed(2)}`;
            }
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Budget Trends</h2>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default BudgetTrendsChart;