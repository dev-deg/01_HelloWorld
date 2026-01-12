import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Typography,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useAppDispatch } from '../../store';
import { addIncome, updateIncome } from '../../store/slices/incomeSlice';
import { IncomeSource } from '../../types';

/**
 * IncomeForm Component
 *
 * Form for adding or editing income sources
 * Demonstrates:
 * - Controlled form components
 * - Dispatching actions to Redux
 * - Conditional rendering (add vs edit mode)
 * - Form validation
 */

interface IncomeFormProps {
  editMode?: boolean;
  existingIncome?: IncomeSource;
  onClose?: () => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({
  editMode = false,
  existingIncome,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'one-time'>('monthly');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load existing income data if in edit mode
  useEffect(() => {
    if (editMode && existingIncome) {
      setName(existingIncome.name);
      setAmount(existingIncome.amount.toString());
      setFrequency(existingIncome.frequency);
      setDate(existingIncome.date.split('T')[0]);
    }
  }, [editMode, existingIncome]);

  /**
   * Handle form submission
   * Creates a new income source or updates existing one
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!name || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const incomeData: IncomeSource = {
      id: editMode && existingIncome ? existingIncome.id : Date.now().toString(),
      name,
      amount: parseFloat(amount),
      frequency,
      date: new Date(date).toISOString(),
    };

    // Dispatch appropriate action based on mode
    if (editMode) {
      dispatch(updateIncome(incomeData));
    } else {
      dispatch(addIncome(incomeData));
    }

    // Reset form
    if (!editMode) {
      setName('');
      setAmount('');
      setFrequency('monthly');
      setDate(new Date().toISOString().split('T')[0]);
    }

    // Close dialog if in edit mode
    if (onClose) {
      onClose();
    }
  };

  const formContent = (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Income Source Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
        required
        placeholder="e.g., Student Loan, Part-time Job"
      />

      <TextField
        fullWidth
        label="Amount (£)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        margin="normal"
        required
        inputProps={{ step: '0.01', min: '0' }}
      />

      <TextField
        fullWidth
        select
        label="Frequency"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as any)}
        margin="normal"
        required
      >
        <MenuItem value="weekly">Weekly</MenuItem>
        <MenuItem value="monthly">Monthly</MenuItem>
        <MenuItem value="one-time">One-time</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      {editMode ? (
        <DialogActions sx={{ px: 0, pt: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Update Income
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
          Add Income Source
        </Button>
      )}
    </Box>
  );

  // Render differently based on mode
  if (editMode) {
    return (
      <>
        <DialogTitle>Edit Income Source</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Income Source
        </Typography>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default IncomeForm;
