import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import RecentActivity from './RecentActivity';

describe('RecentActivity', () => {
  describe('rendering', () => {
    it('renders the activity title', () => {
      renderWithProviders(<RecentActivity />);

      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('displays empty state message when no activity exists', () => {
      renderWithProviders(<RecentActivity />);

      expect(screen.getByText('No activity yet')).toBeInTheDocument();
    });

    it('renders activity items when data exists', () => {
      renderWithProviders(<RecentActivity />, {
        preloadedState: populatedTestState,
      });

      // Should not show empty message
      expect(screen.queryByText('No activity yet')).not.toBeInTheDocument();
    });
  });

  describe('activity display', () => {
    it('displays income items with correct formatting', () => {
      renderWithProviders(<RecentActivity />, {
        preloadedState: populatedTestState,
      });

      // Check for income source names
      expect(screen.getByText('Part-time Job')).toBeInTheDocument();
      expect(screen.getByText('Student Loan')).toBeInTheDocument();
    });

    it('displays expense items with correct formatting', () => {
      renderWithProviders(<RecentActivity />, {
        preloadedState: populatedTestState,
      });

      // Check for expense descriptions
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Bus Pass')).toBeInTheDocument();
    });

    it('shows positive amounts for income', () => {
      renderWithProviders(<RecentActivity />, {
        preloadedState: {
          income: {
            sources: [
              {
                id: '1',
                name: 'Test Income',
                amount: 100,
                frequency: 'monthly',
                date: new Date().toISOString(),
              },
            ],
          },
          expenses: { items: [] },
          savings: { goals: [] },
        },
      });

      expect(screen.getByText('+£100.00')).toBeInTheDocument();
    });

    it('shows negative amounts for expenses', () => {
      renderWithProviders(<RecentActivity />, {
        preloadedState: {
          income: { sources: [] },
          expenses: {
            items: [
              {
                id: '1',
                description: 'Test Expense',
                amount: 50,
                category: 'food',
                date: new Date().toISOString(),
              },
            ],
          },
          savings: { goals: [] },
        },
      });

      expect(screen.getByText('-£50.00')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('shows most recent items first', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      renderWithProviders(<RecentActivity />, {
        preloadedState: {
          income: {
            sources: [
              {
                id: '1',
                name: 'Old Income',
                amount: 100,
                frequency: 'monthly',
                date: yesterday.toISOString(),
              },
            ],
          },
          expenses: {
            items: [
              {
                id: '1',
                description: 'New Expense',
                amount: 50,
                category: 'food',
                date: today.toISOString(),
              },
            ],
          },
          savings: { goals: [] },
        },
      });

      const items = screen.getAllByRole('listitem');
      // New Expense should appear before Old Income
      const newExpenseIndex = items.findIndex((item) =>
        item.textContent?.includes('New Expense')
      );
      const oldIncomeIndex = items.findIndex((item) =>
        item.textContent?.includes('Old Income')
      );

      expect(newExpenseIndex).toBeLessThan(oldIncomeIndex);
    });
  });

  describe('limit', () => {
    it('limits display to 10 most recent items', () => {
      // Create 15 expenses
      const expenses = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        description: `Expense ${i + 1}`,
        amount: 10,
        category: 'food' as const,
        date: new Date(2024, 0, i + 1).toISOString(),
      }));

      renderWithProviders(<RecentActivity />, {
        preloadedState: {
          income: { sources: [] },
          expenses: { items: expenses },
          savings: { goals: [] },
        },
      });

      const items = screen.getAllByRole('listitem');
      expect(items).toHaveLength(10);
    });
  });
});
