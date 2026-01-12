import { describe, it, expect } from 'vitest';
import incomeReducer, {
  addIncome,
  updateIncome,
  deleteIncome,
  loadIncome,
} from './incomeSlice';
import { IncomeSource } from '../../types';

describe('incomeSlice', () => {
  const initialState = {
    sources: [],
  };

  const sampleIncome: IncomeSource = {
    id: '1',
    name: 'Part-time Job',
    amount: 500,
    frequency: 'monthly',
    date: '2024-01-15T00:00:00.000Z',
  };

  describe('addIncome', () => {
    it('adds a new income source to empty state', () => {
      const result = incomeReducer(initialState, addIncome(sampleIncome));

      expect(result.sources).toHaveLength(1);
      expect(result.sources[0]).toEqual(sampleIncome);
    });

    it('adds a new income source to existing state', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const newIncome: IncomeSource = {
        id: '2',
        name: 'Student Loan',
        amount: 200,
        frequency: 'weekly',
        date: '2024-01-10T00:00:00.000Z',
      };

      const result = incomeReducer(existingState, addIncome(newIncome));

      expect(result.sources).toHaveLength(2);
      expect(result.sources[1]).toEqual(newIncome);
    });
  });

  describe('updateIncome', () => {
    it('updates an existing income source', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const updatedIncome: IncomeSource = {
        ...sampleIncome,
        amount: 600,
        name: 'Updated Job',
      };

      const result = incomeReducer(existingState, updateIncome(updatedIncome));

      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].amount).toBe(600);
      expect(result.sources[0].name).toBe('Updated Job');
    });

    it('does not modify state if income id not found', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const nonExistentIncome: IncomeSource = {
        id: 'non-existent',
        name: 'Unknown',
        amount: 100,
        frequency: 'monthly',
        date: '2024-01-01T00:00:00.000Z',
      };

      const result = incomeReducer(existingState, updateIncome(nonExistentIncome));

      expect(result.sources).toHaveLength(1);
      expect(result.sources[0]).toEqual(sampleIncome);
    });
  });

  describe('deleteIncome', () => {
    it('removes an income source by id', () => {
      const existingState = {
        sources: [
          sampleIncome,
          {
            id: '2',
            name: 'Student Loan',
            amount: 200,
            frequency: 'weekly' as const,
            date: '2024-01-10T00:00:00.000Z',
          },
        ],
      };

      const result = incomeReducer(existingState, deleteIncome('1'));

      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].id).toBe('2');
    });

    it('does not modify state if income id not found', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const result = incomeReducer(existingState, deleteIncome('non-existent'));

      expect(result.sources).toHaveLength(1);
    });
  });

  describe('loadIncome', () => {
    it('replaces all income sources', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const newSources: IncomeSource[] = [
        {
          id: '3',
          name: 'Freelance',
          amount: 1000,
          frequency: 'one-time',
          date: '2024-02-01T00:00:00.000Z',
        },
        {
          id: '4',
          name: 'Gift',
          amount: 50,
          frequency: 'one-time',
          date: '2024-02-05T00:00:00.000Z',
        },
      ];

      const result = incomeReducer(existingState, loadIncome(newSources));

      expect(result.sources).toHaveLength(2);
      expect(result.sources).toEqual(newSources);
    });

    it('can load empty array', () => {
      const existingState = {
        sources: [sampleIncome],
      };

      const result = incomeReducer(existingState, loadIncome([]));

      expect(result.sources).toHaveLength(0);
    });
  });
});
