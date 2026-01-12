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
import { addExpense, updateExpense } from '../../store/slices/expensesSlice';
import { Expense, ExpenseCategory } from '../../types';

/**
 * ExpenseForm Component
 *
 * Form for adding or editing expenses
 * Demonstrates:
 * - Form handling with categories
 * - Redux action dispatching
 * - TypeScript type narrowing
 */

interface ExpenseFormProps {
  editMode?: boolean;
  existingExpense?: Expense;
  onClose?: () => void;
}

// Available expense categories
const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: '🍔 Food' },
  { value: 'transport', label: '🚌 Transport' },
  { value: 'accommodation', label: '🏠 Accommodation' },
  { value: 'books', label: '📚 Books' },
  { value: 'entertainment', label: '🎮 Entertainment' },
  { value: 'utilities', label: '💡 Utilities' },
  { value: 'other', label: '📦 Other' },
];

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  editMode = false,
  existingExpense,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  // Form state
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Load existing expense data if in edit mode
  useEffect(() => {
    if (editMode && existingExpense) {
      setDescription(existingExpense.description);
      setAmount(existingExpense.amount.toString());
      setCategory(existingExpense.category);
      setDate(existingExpense.date.split('T')[0]);
    }
  }, [editMode, existingExpense]);

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!description || !amount || parseFloat(amount) <= 0) {
      return;
    }

    const expenseData: Expense = {
      id: editMode && existingExpense ? existingExpense.id : Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
    };

    // Dispatch appropriate action
    if (editMode) {
      dispatch(updateExpense(expenseData));
    } else {
      dispatch(addExpense(expenseData));
    }

    // Reset form
    if (!editMode) {
      setDescription('');
      setAmount('');
      setCategory('food');
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
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
        required
        placeholder="e.g., Grocery shopping, Bus ticket"
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
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        margin="normal"
        required
      >
        {categories.map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
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
            Update Expense
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
          Add Expense
        </Button>
      )}
    </Box>
  );

  if (editMode) {
    return (
      <>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Add Expense
        </Typography>
        {formContent}
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
