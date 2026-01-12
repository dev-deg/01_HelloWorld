import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import incomeReducer from './slices/incomeSlice';
import expensesReducer from './slices/expensesSlice';
import savingsReducer from './slices/savingsSlice';

/**
 * Redux Store Configuration
 *
 * This file demonstrates:
 * - Configuring a Redux store with Redux Toolkit
 * - Combining multiple slice reducers
 * - Creating typed hooks for better TypeScript support
 * - Adding middleware for localStorage persistence
 */

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // Each slice manages its own piece of state
    income: incomeReducer,
    expenses: expensesReducer,
    savings: savingsReducer,
  },
  // Redux Toolkit includes redux-thunk middleware by default
  // and enables Redux DevTools in development
});

/**
 * Type Definitions for TypeScript Support
 * These types ensure type safety when working with Redux
 */

// Infer the type of the store's state from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the type of the dispatch function
export type AppDispatch = typeof store.dispatch;

/**
 * Typed Hooks
 *
 * These pre-typed hooks eliminate the need to type the hooks manually
 * Usage: const dispatch = useAppDispatch() instead of useDispatch<AppDispatch>()
 */

// Pre-typed useDispatch hook
export const useAppDispatch: () => AppDispatch = useDispatch;

// Pre-typed useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
