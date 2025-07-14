import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function IncomeExpenseChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="income" name="Income" fill="#3498db" />
        <Bar dataKey="expenses" name="Expenses" fill="#e74c3c" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;