import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useAppSelector } from '../../store';
import { ExpenseCategory } from '../../types';

/**
 * ExpenseChart Component
 *
 * Visualizes expenses by category using a pie chart
 * Demonstrates:
 * - Data aggregation and transformation
 * - Chart integration with Recharts
 * - Responsive design
 */

// Category colors matching ExpenseList
const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#FF6B6B',
  transport: '#4ECDC4',
  accommodation: '#45B7D1',
  books: '#FFA07A',
  entertainment: '#98D8C8',
  utilities: '#F7B731',
  other: '#95A5A6',
};

const ExpenseChart: React.FC = () => {
  const expenses = useAppSelector((state) => state.expenses.items);

  /**
   * Aggregate expenses by category
   * Returns an array of objects suitable for charting
   */
  const aggregateByCategory = () => {
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    // Convert to array format for Recharts
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: parseFloat(amount.toFixed(2)),
      color: CATEGORY_COLORS[category as ExpenseCategory],
    }));
  };

  const chartData = aggregateByCategory();

  // Custom label renderer for pie chart
  const renderLabel = (entry: any) => {
    const percent = ((entry.value / entry.payload.total) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expenses by Category
        </Typography>

        {chartData.length === 0 ? (
          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography color="text.secondary">
              No expense data to display
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `£${value.toFixed(2)}`}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
