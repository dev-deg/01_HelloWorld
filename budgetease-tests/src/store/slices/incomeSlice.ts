import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IncomeSource } from '../../types';

/**
 * Income Slice - Manages income sources in the Redux store
 *
 * This slice demonstrates:
 * - Creating a slice with Redux Toolkit
 * - Using PayloadAction for type-safe actions
 * - Immutable state updates with Immer (built into Redux Toolkit)
 */

interface IncomeState {
  sources: IncomeSource[];
}

const initialState: IncomeState = {
  sources: [],
};

const incomeSlice = createSlice({
  name: 'income', // Used as prefix for action types
  initialState,
  reducers: {
    /**
     * Add a new income source
     * Action creator will be automatically generated
     */
    addIncome: (state, action: PayloadAction<IncomeSource>) => {
      // Redux Toolkit uses Immer, so we can "mutate" state directly
      state.sources.push(action.payload);
    },

    /**
     * Update an existing income source
     */
    updateIncome: (state, action: PayloadAction<IncomeSource>) => {
      const index = state.sources.findIndex(
        source => source.id === action.payload.id
      );
      if (index !== -1) {
        state.sources[index] = action.payload;
      }
    },

    /**
     * Delete an income source by ID
     */
    deleteIncome: (state, action: PayloadAction<string>) => {
      state.sources = state.sources.filter(
        source => source.id !== action.payload
      );
    },

    /**
     * Load income sources from storage (used for persistence)
     */
    loadIncome: (state, action: PayloadAction<IncomeSource[]>) => {
      state.sources = action.payload;
    },
  },
});

// Export action creators - these are automatically generated
export const { addIncome, updateIncome, deleteIncome, loadIncome } = incomeSlice.actions;

// Export reducer to be included in store
export default incomeSlice.reducer;
