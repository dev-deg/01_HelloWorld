import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useAppSelector } from '../../store';
import SavingsGoalForm from './SavingsGoalForm';
import SavingsGoalCard from './SavingsGoalCard';

/**
 * Savings Goals Page
 *
 * Main page component for managing savings goals
 * Demonstrates using selectors to read from Redux store
 */

const SavingsPage: React.FC = () => {
  const savingsGoals = useAppSelector((state) => state.savings.goals);

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Savings Goals
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Set financial goals and track your progress towards achieving them.
      </Typography>

      <Box sx={{ mt: 3 }}>
        <SavingsGoalForm />

        {savingsGoals.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No savings goals yet. Create your first goal above!
          </Typography>
        ) : (
          <Box sx={{ mt: 3 }}>
            {savingsGoals.map((goal) => (
              <SavingsGoalCard key={goal.id} goal={goal} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SavingsPage;
