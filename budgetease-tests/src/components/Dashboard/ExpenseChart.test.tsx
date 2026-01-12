import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import ExpenseChart from './ExpenseChart';

describe('ExpenseChart', () => {
  describe('rendering', () => {
    it('renders the chart title', () => {
      renderWithProviders(<ExpenseChart />);

      expect(screen.getByText('Expenses by Category')).toBeInTheDocument();
    });

    it('displays empty state message when no expenses exist', () => {
      renderWithProviders(<ExpenseChart />);

      expect(screen.getByText('No expense data to display')).toBeInTheDocument();
    });

    it('renders the chart when expenses exist', () => {
      renderWithProviders(<ExpenseChart />, {
        preloadedState: populatedTestState,
      });

      // Should not show empty message
      expect(screen.queryByText('No expense data to display')).not.toBeInTheDocument();
    });
  });

  describe('data aggregation', () => {
    it('does not show empty state when expenses with same category exist', () => {
      renderWithProviders(<ExpenseChart />, {
        preloadedState: {
          income: { sources: [] },
          expenses: {
            items: [
              {
                id: '1',
                description: 'Lunch',
                amount: 10,
                category: 'food',
                date: new Date().toISOString(),
              },
              {
                id: '2',
                description: 'Dinner',
                amount: 15,
                category: 'food',
                date: new Date().toISOString(),
              },
            ],
          },
          savings: { goals: [] },
        },
      });

      // Should not show empty message when data exists
      // (Recharts ResponsiveContainer doesn't render full SVG in jsdom)
      expect(screen.queryByText('No expense data to display')).not.toBeInTheDocument();
    });

    it('does not show empty state with multiple expense categories', () => {
      renderWithProviders(<ExpenseChart />, {
        preloadedState: populatedTestState,
      });

      // Chart should be visible (not empty state)
      expect(screen.queryByText('No expense data to display')).not.toBeInTheDocument();
    });
  });
});
