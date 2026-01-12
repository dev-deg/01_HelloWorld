import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

/**
 * Expense Management Page
 *
 * Main page component for tracking expenses
 */

const ExpensesPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Expenses
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your spending by category to understand where your money goes.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <ExpenseForm />
        <ExpenseList />
      </Box>
    </Container>
  );
};

export default ExpensesPage;
