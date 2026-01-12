import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Savings as SavingsIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store';

/**
 * FinancialSummary Component
 *
 * Displays key financial metrics calculated from Redux state
 * Demonstrates:
 * - Using selectors to compute derived data
 * - Responsive grid layout
 * - Icon integration
 */

const FinancialSummary: React.FC = () => {
  // Select data from Redux store
  const incomeSources = useAppSelector((state) => state.income.sources);
  const expenses = useAppSelector((state) => state.expenses.items);
  const savingsGoals = useAppSelector((state) => state.savings.goals);

  /**
   * Calculate total monthly income
   * Converts weekly and one-time income to monthly equivalent
   */
  const totalIncome = incomeSources.reduce((sum, source) => {
    if (source.frequency === 'monthly') return sum + source.amount;
    if (source.frequency === 'weekly') return sum + source.amount * 4.33; // Average weeks per month
    if (source.frequency === 'one-time') return sum + source.amount;
    return sum;
  }, 0);

  /**
   * Calculate total expenses
   */
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  /**
   * Calculate net balance (income - expenses)
   */
  const netBalance = totalIncome - totalExpenses;

  /**
   * Calculate total savings (current amount in all goals)
   */
  const totalSavings = savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  // Summary cards configuration
  const summaryCards = [
    {
      title: 'Total Income',
      value: totalIncome,
      icon: <TrendingUpIcon />,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Total Expenses',
      value: totalExpenses,
      icon: <TrendingDownIcon />,
      color: '#F44336',
      bgColor: 'rgba(244, 67, 54, 0.1)',
    },
    {
      title: 'Net Balance',
      value: netBalance,
      icon: <AccountBalanceIcon />,
      color: netBalance >= 0 ? '#2196F3' : '#FF9800',
      bgColor: netBalance >= 0 ? 'rgba(33, 150, 243, 0.1)' : 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Total Savings',
      value: totalSavings,
      icon: <SavingsIcon />,
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.1)',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {summaryCards.map((card, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Card sx={{ bgcolor: card.bgColor, height: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                >
                  {card.title}
                </Typography>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: card.color,
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                £{card.value.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FinancialSummary;
