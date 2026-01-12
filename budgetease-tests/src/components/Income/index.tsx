import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import IncomeForm from './IncomeForm';
import IncomeList from './IncomeList';

/**
 * Income Management Page
 *
 * Main page component that combines the income form and list
 * Demonstrates component composition
 */

const IncomePage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Income Sources
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track your stipend, apprenticeship income, and other sources of money.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <IncomeForm />
        <IncomeList />
      </Box>
    </Container>
  );
};

export default IncomePage;
