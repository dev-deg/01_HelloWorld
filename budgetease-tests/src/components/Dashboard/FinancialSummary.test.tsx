import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import FinancialSummary from './FinancialSummary';

describe('FinancialSummary', () => {
  describe('rendering', () => {
    it('renders all four summary cards', () => {
      renderWithProviders(<FinancialSummary />);

      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Balance')).toBeInTheDocument();
      expect(screen.getByText('Total Savings')).toBeInTheDocument();
    });

    it('displays zero values when no data exists', () => {
      renderWithProviders(<FinancialSummary />);

      // All values should be £0.00
      const zeroValues = screen.getAllByText('£0.00');
      expect(zeroValues).toHaveLength(4);
    });
  });

  describe('calculations', () => {
    it('calculates total income correctly with different frequencies', () => {
      // Monthly: £500, Weekly: £200 * 4.33 = £866
      // Total expected: £500 + £866 = £1366
      renderWithProviders(<FinancialSummary />, {
        preloadedState: populatedTestState,
      });

      // Find the Total Income card value
      // The calculation is: 500 (monthly) + 200 * 4.33 (weekly) = 1366
      expect(screen.getByText('£1366.00')).toBeInTheDocument();
    });

    it('calculates total expenses correctly', () => {
      // Groceries: £75.50 + Bus Pass: £45 + Textbooks: £120 = £240.50
      renderWithProviders(<FinancialSummary />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('£240.50')).toBeInTheDocument();
    });

    it('calculates net balance correctly', () => {
      // Net Balance = Total Income - Total Expenses
      // 1366 - 240.50 = 1125.50
      renderWithProviders(<FinancialSummary />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('£1125.50')).toBeInTheDocument();
    });

    it('calculates total savings correctly', () => {
      // Emergency Fund: £350 + New Laptop: £200 = £550
      renderWithProviders(<FinancialSummary />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('£550.00')).toBeInTheDocument();
    });
  });

  describe('income frequency handling', () => {
    it('handles monthly income correctly', () => {
      renderWithProviders(<FinancialSummary />, {
        preloadedState: {
          income: {
            sources: [
              {
                id: '1',
                name: 'Job',
                amount: 1000,
                frequency: 'monthly',
                date: new Date().toISOString(),
              },
            ],
          },
          expenses: { items: [] },
          savings: { goals: [] },
        },
      });

      // £1000.00 appears twice (Total Income and Net Balance when no expenses)
      const amounts = screen.getAllByText('£1000.00');
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });

    it('handles weekly income correctly (multiplies by 4.33)', () => {
      renderWithProviders(<FinancialSummary />, {
        preloadedState: {
          income: {
            sources: [
              {
                id: '1',
                name: 'Weekly Job',
                amount: 100,
                frequency: 'weekly',
                date: new Date().toISOString(),
              },
            ],
          },
          expenses: { items: [] },
          savings: { goals: [] },
        },
      });

      // 100 * 4.33 = 433
      // Value appears in both Total Income and Net Balance
      const amounts = screen.getAllByText('£433.00');
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });

    it('handles one-time income correctly', () => {
      renderWithProviders(<FinancialSummary />, {
        preloadedState: {
          income: {
            sources: [
              {
                id: '1',
                name: 'Bonus',
                amount: 500,
                frequency: 'one-time',
                date: new Date().toISOString(),
              },
            ],
          },
          expenses: { items: [] },
          savings: { goals: [] },
        },
      });

      // Value appears in both Total Income and Net Balance
      const amounts = screen.getAllByText('£500.00');
      expect(amounts.length).toBeGreaterThanOrEqual(1);
    });
  });
});
