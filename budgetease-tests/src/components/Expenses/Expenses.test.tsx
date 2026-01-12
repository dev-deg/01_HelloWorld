import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import ExpensesPage from './index';

describe('ExpensesPage', () => {
  describe('rendering', () => {
    it('renders the page title', () => {
      renderWithProviders(<ExpensesPage />);

      expect(screen.getByText('Expenses')).toBeInTheDocument();
    });

    it('renders the page description', () => {
      renderWithProviders(<ExpensesPage />);

      expect(
        screen.getByText(
          'Track your spending by category to understand where your money goes.'
        )
      ).toBeInTheDocument();
    });

    it('renders the ExpenseForm component', () => {
      renderWithProviders(<ExpensesPage />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Add Expense' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add expense/i })
      ).toBeInTheDocument();
    });

    it('renders the ExpenseList component', () => {
      renderWithProviders(<ExpensesPage />);

      // In empty state, should show empty message
      expect(
        screen.getByText(/no expenses recorded yet/i)
      ).toBeInTheDocument();
    });
  });
});
