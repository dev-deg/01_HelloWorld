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
import { deleteIncome } from '../../store/slices/incomeSlice';
import { IncomeSource } from '../../types';
import IncomeForm from './IncomeForm';

/**
 * IncomeList Component
 *
 * Displays a list of all income sources and allows editing/deleting
 * Demonstrates:
 * - Reading from Redux store with useAppSelector
 * - Dispatching actions with useAppDispatch
 * - Material-UI list components
 */

const IncomeList: React.FC = () => {
  // Access income sources from Redux store
  const incomeSources = useAppSelector((state) => state.income.sources);
  const dispatch = useAppDispatch();

  // Local state for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);

  /**
   * Handle delete action
   * Dispatches the deleteIncome action to Redux store
   */
  const handleDelete = (id: string) => {
    dispatch(deleteIncome(id));
  };

  /**
   * Open edit dialog with selected income
   */
  const handleEdit = (income: IncomeSource) => {
    setEditingIncome(income);
    setEditDialogOpen(true);
  };

  /**
   * Format frequency for display
   */
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'primary';
      case 'monthly':
        return 'secondary';
      case 'one-time':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      {incomeSources.length === 0 ? (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography color="text.secondary" align="center">
              No income sources yet. Add your first income source above!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ width: '100%' }}>
          {incomeSources.map((income) => (
            <Card key={income.id} sx={{ mb: 2 }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(income)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(income.id)}
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
                      <Typography variant="h6">{income.name}</Typography>
                      <Chip
                        label={income.frequency}
                        size="small"
                        color={getFrequencyColor(income.frequency) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="h6" color="success.main" component="span">
                        £{income.amount.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 2 }}>
                        {new Date(income.date).toLocaleDateString()}
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
        <IncomeForm
          editMode
          existingIncome={editingIncome || undefined}
          onClose={() => setEditDialogOpen(false)}
        />
      </Dialog>
    </Box>
  );
};

export default IncomeList;
