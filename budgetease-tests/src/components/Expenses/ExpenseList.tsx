import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store';
import { deleteExpense } from '../../store/slices/expensesSlice';
import { Expense, ExpenseCategory } from '../../types';
import ExpenseForm from './ExpenseForm';

/**
 * ExpenseList Component
 *
 * Displays all expenses with category-based filtering and sorting
 * Demonstrates:
 * - Reading from Redux store
 * - Conditional rendering
 * - List manipulation
 */

// Category colors for visual distinction
const getCategoryColor = (category: ExpenseCategory): string => {
  const colors: Record<ExpenseCategory, string> = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    accommodation: '#45B7D1',
    books: '#FFA07A',
    entertainment: '#98D8C8',
    utilities: '#F7B731',
    other: '#95A5A6',
  };
  return colors[category];
};

const ExpenseList: React.FC = () => {
  const expenses = useAppSelector((state) => state.expenses.items);
  const dispatch = useAppDispatch();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = (id: string) => {
    dispatch(deleteExpense(id));
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  return (
    <Box>
      {sortedExpenses.length === 0 ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography color="text.secondary" align="center">
              No expenses recorded yet. Start tracking your spending above!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ width: '100%' }}>
          {sortedExpenses.map((expense) => (
            <Card key={expense.id} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(expense)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(expense.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6">{expense.description}</Typography>
                      <Chip
                        label={expense.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(expense.category),
                          color: 'white',
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="h6" color="error.main" component="span">
                        -£{expense.amount.toFixed(2)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ ml: 2 }}
                      >
                        {new Date(expense.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </Card>
          ))}
        </List>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <ExpenseForm
          editMode
          existingExpense={editingExpense || undefined}
          onClose={() => setEditDialogOpen(false)}
        />
      </Dialog>
    </Box>
  );
};

export default ExpenseList;
