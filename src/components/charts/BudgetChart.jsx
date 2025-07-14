import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function BudgetChart({ categories }) {
  const data = categories.map(cat => ({
    name: cat.name,
    Budget: cat.budget,
    Actual: cat.actual,
    color: cat.color
  }));

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
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
        />
        <YAxis />
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Budget" fill="#8884d8" />
        <Bar dataKey="Actual" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BudgetChart;