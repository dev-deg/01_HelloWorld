import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavingsGoal } from '../../types';

/**
 * Savings Slice - Manages savings goals in the Redux store
 *
 * This slice demonstrates:
 * - Managing financial goals
 * - Updating nested properties (currentAmount within a goal)
 * - Complex state updates
 */

interface SavingsState {
  goals: SavingsGoal[];
}

const initialState: SavingsState = {
  goals: [],
};

const savingsSlice = createSlice({
  name: 'savings',
  initialState,
  reducers: {
    /**
     * Add a new savings goal
     */
    addSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      state.goals.push(action.payload);
    },

    /**
     * Update an existing savings goal
     */
    updateSavingsGoal: (state, action: PayloadAction<SavingsGoal>) => {
      const index = state.goals.findIndex(
        goal => goal.id === action.payload.id
      );
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },

    /**
     * Delete a savings goal by ID
     */
    deleteSavingsGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter(
        goal => goal.id !== action.payload
      );
    },

    /**
     * Add money to a specific savings goal
     * Demonstrates updating a nested property
     */
    addToSavingsGoal: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const goal = state.goals.find(g => g.id === action.payload.id);
      if (goal) {
        goal.currentAmount += action.payload.amount;
      }
    },

    /**
     * Load savings goals from storage (used for persistence)
     */
    loadSavings: (state, action: PayloadAction<SavingsGoal[]>) => {
      state.goals = action.payload;
    },
  },
});

// Export action creators
export const {
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal,
  loadSavings,
} = savingsSlice.actions;

// Export reducer
export default savingsSlice.reducer;
