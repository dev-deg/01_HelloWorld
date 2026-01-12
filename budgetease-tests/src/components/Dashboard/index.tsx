import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import FinancialSummary from './FinancialSummary';
import ExpenseChart from './ExpenseChart';
import RecentActivity from './RecentActivity';

/**
 * Dashboard Page
 *
 * Main overview page showing financial summary and insights
 * Demonstrates:
 * - Component composition
 * - Responsive grid layout
 * - Combining multiple data visualizations
 */

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your financial overview at a glance
        </Typography>
      </Box>

      {/* Financial Summary Cards */}
      <FinancialSummary />

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ExpenseChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
