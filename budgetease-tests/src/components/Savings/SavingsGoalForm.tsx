import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useAppDispatch } from '../../store';
import { addSavingsGoal, updateSavingsGoal } from '../../store/slices/savingsSlice';
import { SavingsGoal } from '../../types';

/**
 * SavingsGoalForm Component
 *
 * Form for creating or editing savings goals
 */

interface SavingsGoalFormProps {
  editMode?: boolean;
  existingGoal?: SavingsGoal;
  onClose?: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({
  editMode = false,
  existingGoal,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Form state
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [description, setDescription] = useState('');

  // Load existing goal data if in edit mode
  useEffect(() => {
    if (editMode && existingGoal) {
      setName(existingGoal.name);
      setTargetAmount(existingGoal.targetAmount.toString());
      setCurrentAmount(existingGoal.currentAmount.toString());
      setDeadline(existingGoal.deadline.split('T')[0]);
      setDescription(existingGoal.description || '');
    }
  }, [editMode, existingGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !targetAmount || parseFloat(targetAmount) <= 0) {
      return;
    }

    const goalData: SavingsGoal = {
      id: editMode && existingGoal ? existingGoal.id : Date.now().toString(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount),
      deadline: new Date(deadline).toISOString(),
      description: description || undefined,
    };

    if (editMode) {
      dispatch(updateSavingsGoal(goalData));
    } else {
      dispatch(addSavingsGoal(goalData));
    }

    // Reset form
    if (!editMode) {
      setName('');
      setTargetAmount('');
      setCurrentAmount('0');
      setDeadline(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
      setDescription('');
    }

    if (onClose) {
      onClose();
    }
  };

  const formContent = (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Goal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
        placeholder="e.g., Emergency Fund, New Laptop"
      />

      <TextField
        fullWidth
        label="Target Amount (£)"
        type="number"
        value={targetAmount}
        onChange={(e) => setTargetAmount(e.target.value)}
        margin="normal"
        required
        inputProps={{ step: '0.01', min: '0' }}
      />

      <TextField
        fullWidth
        label="Current Amount (£)"
        type="number"
        value={currentAmount}
        onChange={(e) => setCurrentAmount(e.target.value)}
        margin="normal"
        inputProps={{ step: '0.01', min: '0' }}
      />

      <TextField
        fullWidth
        label="Deadline"
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Description (Optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        multiline
        rows={2}
        placeholder="What are you saving for?"
      />

      {editMode ? (
        <DialogActions sx={{ px: 0, pt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update Goal
          </Button>
        </DialogActions>
      ) : (
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Create Savings Goal
        </Button>
      )}
    </Box>
  );

  if (editMode) {
    return (
      <>
        <DialogTitle>Edit Savings Goal</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create Savings Goal
        </Typography>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default SavingsGoalForm;
