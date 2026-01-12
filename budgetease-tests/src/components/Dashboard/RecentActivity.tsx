import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon,
  TrendingDown as ExpenseIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store';

/**
 * RecentActivity Component
 *
 * Displays recent income and expense transactions
 * Demonstrates:
 * - Combining data from multiple slices
 * - Sorting and limiting data
 * - Conditional styling
 */

const RecentActivity: React.FC = () => {
  const incomeSources = useAppSelector((state) => state.income.sources);
  const expenses = useAppSelector((state) => state.expenses.items);

  /**
   * Combine and sort recent transactions
   */
  const getRecentActivity = () => {
    // Transform income sources to activity items
    const incomeActivity = incomeSources.map((income) => ({
      id: income.id,
      type: 'income' as const,
      description: income.name,
      amount: income.amount,
      date: new Date(income.date),
      category: income.frequency,
    }));

    // Transform expenses to activity items
    const expenseActivity = expenses.map((expense) => ({
      id: expense.id,
      type: 'expense' as const,
      description: expense.description,
      amount: expense.amount,
      date: new Date(expense.date),
      category: expense.category,
    }));

    // Combine and sort by date (newest first)
    return [...incomeActivity, ...expenseActivity]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10); // Show only 10 most recent
  };

  const recentActivity = getRecentActivity();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>

        {recentActivity.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
            No activity yet
          </Typography>
        ) : (
          <List sx={{ pt: 0 }}>
            {recentActivity.map((activity) => (
              <ListItem
                key={`${activity.type}-${activity.id}`}
                sx={{
                  borderLeft: 3,
                  borderColor: activity.type === 'income' ? 'success.main' : 'error.main',
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    color: activity.type === 'income' ? 'success.main' : 'error.main',
                  }}
                >
                  {activity.type === 'income' ? (
                    <IncomeIcon />
                  ) : (
                    <ExpenseIcon />
                  )}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="body1">
                        {activity.description}
                      </Typography>
                      <Chip
                        label={activity.category}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={activity.date.toLocaleDateString()}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: activity.type === 'income' ? 'success.main' : 'error.main',
                    fontWeight: 'bold',
                  }}
                >
                  {activity.type === 'income' ? '+' : '-'}£
                  {activity.amount.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
