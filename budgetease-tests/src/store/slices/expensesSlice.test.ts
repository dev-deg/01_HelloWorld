import { describe, it, expect } from 'vitest';
import expensesReducer, {
  addExpense,
  updateExpense,
  deleteExpense,
  loadExpenses,
} from './expensesSlice';
import { Expense } from '../../types';

describe('expensesSlice', () => {
  const initialState = {
    items: [],
  };

  const sampleExpense: Expense = {
    id: '1',
    description: 'Groceries',
    amount: 75.5,
    category: 'food',
    date: '2024-01-15T00:00:00.000Z',
  };

  describe('addExpense', () => {
    it('adds a new expense to empty state', () => {
      const result = expensesReducer(initialState, addExpense(sampleExpense));

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(sampleExpense);
    });

    it('adds a new expense to existing state', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const newExpense: Expense = {
        id: '2',
        description: 'Bus Pass',
        amount: 45,
        category: 'transport',
        date: '2024-01-12T00:00:00.000Z',
      };

      const result = expensesReducer(existingState, addExpense(newExpense));

      expect(result.items).toHaveLength(2);
      expect(result.items[1]).toEqual(newExpense);
    });
  });

  describe('updateExpense', () => {
    it('updates an existing expense', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const updatedExpense: Expense = {
        ...sampleExpense,
        amount: 100,
        description: 'Weekly Groceries',
      };

      const result = expensesReducer(existingState, updateExpense(updatedExpense));

      expect(result.items).toHaveLength(1);
      expect(result.items[0].amount).toBe(100);
      expect(result.items[0].description).toBe('Weekly Groceries');
    });

    it('does not modify state if expense id not found', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const nonExistentExpense: Expense = {
        id: 'non-existent',
        description: 'Unknown',
        amount: 10,
        category: 'other',
        date: '2024-01-01T00:00:00.000Z',
      };

      const result = expensesReducer(existingState, updateExpense(nonExistentExpense));

      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(sampleExpense);
    });
  });

  describe('deleteExpense', () => {
    it('removes an expense by id', () => {
      const existingState = {
        items: [
          sampleExpense,
          {
            id: '2',
            description: 'Bus Pass',
            amount: 45,
            category: 'transport' as const,
            date: '2024-01-12T00:00:00.000Z',
          },
        ],
      };

      const result = expensesReducer(existingState, deleteExpense('1'));

      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe('2');
    });

    it('does not modify state if expense id not found', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const result = expensesReducer(existingState, deleteExpense('non-existent'));

      expect(result.items).toHaveLength(1);
    });
  });

  describe('loadExpenses', () => {
    it('replaces all expenses', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const newExpenses: Expense[] = [
        {
          id: '3',
          description: 'Textbooks',
          amount: 120,
          category: 'books',
          date: '2024-02-01T00:00:00.000Z',
        },
        {
          id: '4',
          description: 'Netflix',
          amount: 15,
          category: 'entertainment',
          date: '2024-02-05T00:00:00.000Z',
        },
      ];

      const result = expensesReducer(existingState, loadExpenses(newExpenses));

      expect(result.items).toHaveLength(2);
      expect(result.items).toEqual(newExpenses);
    });

    it('can load empty array', () => {
      const existingState = {
        items: [sampleExpense],
      };

      const result = expensesReducer(existingState, loadExpenses([]));

      expect(result.items).toHaveLength(0);
    });
  });

  describe('expense categories', () => {
    it('handles all expense categories', () => {
      const categories = [
        'food',
        'transport',
        'accommodation',
        'books',
        'entertainment',
        'utilities',
        'other',
      ] as const;

      categories.forEach((category, index) => {
        const expense: Expense = {
          id: `cat-${index}`,
          description: `Test ${category}`,
          amount: 10,
          category,
          date: '2024-01-01T00:00:00.000Z',
        };

        const result = expensesReducer(initialState, addExpense(expense));
        expect(result.items[0].category).toBe(category);
      });
    });
  });
});
