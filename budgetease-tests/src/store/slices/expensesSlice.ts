import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types';

/**
 * Expenses Slice - Manages expense tracking in the Redux store
 *
 * This slice demonstrates:
 * - Managing a list of items in Redux state
 * - CRUD operations (Create, Read, Update, Delete)
 * - Type-safe payload handling
 */

interface ExpensesState {
  items: Expense[];
}

const initialState: ExpensesState = {
  items: [],
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    /**
     * Add a new expense
     */
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.items.push(action.payload);
    },

    /**
     * Update an existing expense
     */
    updateExpense: (state, action: PayloadAction<Expense>) => {
      const index = state.items.findIndex(
        expense => expense.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    /**
     * Delete an expense by ID
     */
    deleteExpense: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        expense => expense.id !== action.payload
      );
    },

    /**
     * Load expenses from storage (used for persistence)
     */
    loadExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.items = action.payload;
    },
  },
});

// Export action creators
export const { addExpense, updateExpense, deleteExpense, loadExpenses } = expensesSlice.actions;

// Export reducer
export default expensesSlice.reducer;
