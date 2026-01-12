import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAppDispatch } from '../../store';
import {
  deleteSavingsGoal,
  addToSavingsGoal,
} from '../../store/slices/savingsSlice';
import { SavingsGoal } from '../../types';
import SavingsGoalForm from './SavingsGoalForm';

/**
 * SavingsGoalCard Component
 *
 * Displays a single savings goal with progress bar
 * Demonstrates:
 * - Complex state interactions
 * - Progress calculation
 * - Nested dialogs
 */

interface SavingsGoalCardProps {
  goal: SavingsGoal;
}

const SavingsGoalCard: React.FC<SavingsGoalCardProps> = ({ goal }) => {
  const dispatch = useAppDispatch();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addMoneyDialogOpen, setAddMoneyDialogOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Calculate progress percentage
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  // Calculate days remaining
  const daysRemaining = Math.ceil(
    (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleDelete = () => {
    dispatch(deleteSavingsGoal(goal.id));
  };

  const handleAddMoney = () => {
    const amount = parseFloat(amountToAdd);
    if (amount > 0) {
      dispatch(addToSavingsGoal({ id: goal.id, amount }));
      setAmountToAdd('');
      setAddMoneyDialogOpen(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Box>
              <Typography variant="h6">{goal.name}</Typography>
              {goal.description && (
                <Typography variant="body2" color="text.secondary">
                  {goal.description}
                </Typography>
              )}
            </Box>
            <Box>
              <IconButton
                size="small"
                onClick={() => setAddMoneyDialogOpen(true)}
                color="success"
                aria-label="add money"
              >
                <AddIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setEditDialogOpen(true)}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleDelete}
                color="error"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {progress.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progress >= 100 ? '#4CAF50' : '#2196F3',
                },
              }}
            />
          </Box>

          {/* Amount Display */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Box>
              <Typography variant="h5" color="primary">
                £{goal.currentAmount.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                of £{goal.targetAmount.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="body2"
                color={daysRemaining < 0 ? 'error' : 'text.secondary'}
              >
                {daysRemaining < 0
                  ? 'Overdue'
                  : `${daysRemaining} days left`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(goal.deadline).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <SavingsGoalForm
          editMode
          existingGoal={goal}
          onClose={() => setEditDialogOpen(false)}
        />
      </Dialog>

      {/* Add Money Dialog */}
      <Dialog
        open={addMoneyDialogOpen}
        onClose={() => setAddMoneyDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Money to {goal.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (£)"
            type="number"
            fullWidth
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            inputProps={{ step: '0.01', min: '0' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMoneyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMoney} variant="contained" color="success">
            Add Money
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SavingsGoalCard;
