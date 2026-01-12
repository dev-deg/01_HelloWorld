import { describe, it, expect } from 'vitest';
import savingsReducer, {
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addToSavingsGoal,
  loadSavings,
} from './savingsSlice';
import { SavingsGoal } from '../../types';

describe('savingsSlice', () => {
  const initialState = {
    goals: [],
  };

  const sampleGoal: SavingsGoal = {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 350,
    deadline: '2024-06-01T00:00:00.000Z',
    description: 'For unexpected expenses',
  };

  describe('addSavingsGoal', () => {
    it('adds a new savings goal to empty state', () => {
      const result = savingsReducer(initialState, addSavingsGoal(sampleGoal));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0]).toEqual(sampleGoal);
    });

    it('adds a new savings goal to existing state', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const newGoal: SavingsGoal = {
        id: '2',
        name: 'New Laptop',
        targetAmount: 800,
        currentAmount: 200,
        deadline: '2024-09-01T00:00:00.000Z',
      };

      const result = savingsReducer(existingState, addSavingsGoal(newGoal));

      expect(result.goals).toHaveLength(2);
      expect(result.goals[1]).toEqual(newGoal);
    });

    it('handles goal without description', () => {
      const goalWithoutDesc: SavingsGoal = {
        id: '3',
        name: 'Simple Goal',
        targetAmount: 500,
        currentAmount: 0,
        deadline: '2024-12-01T00:00:00.000Z',
      };

      const result = savingsReducer(initialState, addSavingsGoal(goalWithoutDesc));

      expect(result.goals[0].description).toBeUndefined();
    });
  });

  describe('updateSavingsGoal', () => {
    it('updates an existing savings goal', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const updatedGoal: SavingsGoal = {
        ...sampleGoal,
        currentAmount: 500,
        name: 'Updated Emergency Fund',
      };

      const result = savingsReducer(existingState, updateSavingsGoal(updatedGoal));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].currentAmount).toBe(500);
      expect(result.goals[0].name).toBe('Updated Emergency Fund');
    });

    it('does not modify state if goal id not found', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const nonExistentGoal: SavingsGoal = {
        id: 'non-existent',
        name: 'Unknown',
        targetAmount: 100,
        currentAmount: 0,
        deadline: '2024-01-01T00:00:00.000Z',
      };

      const result = savingsReducer(existingState, updateSavingsGoal(nonExistentGoal));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0]).toEqual(sampleGoal);
    });
  });

  describe('deleteSavingsGoal', () => {
    it('removes a savings goal by id', () => {
      const existingState = {
        goals: [
          sampleGoal,
          {
            id: '2',
            name: 'New Laptop',
            targetAmount: 800,
            currentAmount: 200,
            deadline: '2024-09-01T00:00:00.000Z',
          },
        ],
      };

      const result = savingsReducer(existingState, deleteSavingsGoal('1'));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].id).toBe('2');
    });

    it('does not modify state if goal id not found', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const result = savingsReducer(existingState, deleteSavingsGoal('non-existent'));

      expect(result.goals).toHaveLength(1);
    });
  });

  describe('addToSavingsGoal', () => {
    it('adds money to existing goal', () => {
      const existingState = {
        goals: [sampleGoal], // currentAmount: 350
      };

      const result = savingsReducer(
        existingState,
        addToSavingsGoal({ id: '1', amount: 50 })
      );

      expect(result.goals[0].currentAmount).toBe(400);
    });

    it('handles decimal amounts', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const result = savingsReducer(
        existingState,
        addToSavingsGoal({ id: '1', amount: 25.75 })
      );

      expect(result.goals[0].currentAmount).toBe(375.75);
    });

    it('does not modify state if goal id not found', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const result = savingsReducer(
        existingState,
        addToSavingsGoal({ id: 'non-existent', amount: 100 })
      );

      expect(result.goals[0].currentAmount).toBe(350);
    });

    it('allows adding beyond target amount', () => {
      const existingState = {
        goals: [sampleGoal], // target: 1000, current: 350
      };

      const result = savingsReducer(
        existingState,
        addToSavingsGoal({ id: '1', amount: 800 })
      );

      expect(result.goals[0].currentAmount).toBe(1150);
    });
  });

  describe('loadSavings', () => {
    it('replaces all savings goals', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const newGoals: SavingsGoal[] = [
        {
          id: '3',
          name: 'Vacation',
          targetAmount: 2000,
          currentAmount: 100,
          deadline: '2024-12-01T00:00:00.000Z',
        },
        {
          id: '4',
          name: 'New Phone',
          targetAmount: 600,
          currentAmount: 300,
          deadline: '2024-07-01T00:00:00.000Z',
        },
      ];

      const result = savingsReducer(existingState, loadSavings(newGoals));

      expect(result.goals).toHaveLength(2);
      expect(result.goals).toEqual(newGoals);
    });

    it('can load empty array', () => {
      const existingState = {
        goals: [sampleGoal],
      };

      const result = savingsReducer(existingState, loadSavings([]));

      expect(result.goals).toHaveLength(0);
    });
  });
});
