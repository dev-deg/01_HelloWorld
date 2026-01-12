import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, PreloadedState } from '@reduxjs/toolkit';
import incomeReducer from '../store/slices/incomeSlice';
import expensesReducer from '../store/slices/expensesSlice';
import savingsReducer from '../store/slices/savingsSlice';
import { RootState } from '../store';

/**
 * Test utilities for rendering components with Redux and other providers
 */

// Create a custom store for testing
export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    reducer: {
      income: incomeReducer,
      expenses: expensesReducer,
      savings: savingsReducer,
    },
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof setupStore>;

// Wrapper that includes all necessary providers
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Sample test data factories
export const createMockIncomeSource = (overrides = {}) => ({
  id: Date.now().toString(),
  name: 'Test Income',
  amount: 1000,
  frequency: 'monthly' as const,
  date: new Date().toISOString(),
  ...overrides,
});

export const createMockExpense = (overrides = {}) => ({
  id: Date.now().toString(),
  description: 'Test Expense',
  amount: 50,
  category: 'food' as const,
  date: new Date().toISOString(),
  ...overrides,
});

export const createMockSavingsGoal = (overrides = {}) => ({
  id: Date.now().toString(),
  name: 'Test Goal',
  targetAmount: 1000,
  currentAmount: 250,
  deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  description: 'Test description',
  ...overrides,
});

// Default test state
export const defaultTestState: PreloadedState<RootState> = {
  income: { sources: [] },
  expenses: { items: [] },
  savings: { goals: [] },
};

// State with sample data
export const populatedTestState: PreloadedState<RootState> = {
  income: {
    sources: [
      {
        id: '1',
        name: 'Part-time Job',
        amount: 500,
        frequency: 'monthly',
        date: '2024-01-15T00:00:00.000Z',
      },
      {
        id: '2',
        name: 'Student Loan',
        amount: 200,
        frequency: 'weekly',
        date: '2024-01-10T00:00:00.000Z',
      },
    ],
  },
  expenses: {
    items: [
      {
        id: '1',
        description: 'Groceries',
        amount: 75.50,
        category: 'food',
        date: '2024-01-14T00:00:00.000Z',
      },
      {
        id: '2',
        description: 'Bus Pass',
        amount: 45,
        category: 'transport',
        date: '2024-01-12T00:00:00.000Z',
      },
      {
        id: '3',
        description: 'Textbooks',
        amount: 120,
        category: 'books',
        date: '2024-01-08T00:00:00.000Z',
      },
    ],
  },
  savings: {
    goals: [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 1000,
        currentAmount: 350,
        deadline: '2024-06-01T00:00:00.000Z',
        description: 'For unexpected expenses',
      },
      {
        id: '2',
        name: 'New Laptop',
        targetAmount: 800,
        currentAmount: 200,
        deadline: '2024-09-01T00:00:00.000Z',
      },
    ],
  },
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
