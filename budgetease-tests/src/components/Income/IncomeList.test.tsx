import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import IncomeList from './IncomeList';

describe('IncomeList', () => {
  describe('rendering', () => {
    it('displays empty state message when no income exists', () => {
      renderWithProviders(<IncomeList />);

      expect(
        screen.getByText(/no income sources yet/i)
      ).toBeInTheDocument();
    });

    it('renders income items when income sources exist', () => {
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('Part-time Job')).toBeInTheDocument();
      expect(screen.getByText('Student Loan')).toBeInTheDocument();
    });

    it('displays income amounts with correct formatting', () => {
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('£500.00')).toBeInTheDocument();
      expect(screen.getByText('£200.00')).toBeInTheDocument();
    });

    it('displays frequency chips', () => {
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('monthly')).toBeInTheDocument();
      expect(screen.getByText('weekly')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('renders delete button for each income source', () => {
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it('removes income source from store when delete is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(store.getState().income.sources).toHaveLength(1);
      });
    });
  });

  describe('edit functionality', () => {
    it('renders edit button for each income source', () => {
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons).toHaveLength(2);
    });

    it('opens edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Edit Income Source')).toBeInTheDocument();
      });
    });

    it('populates edit form with income data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncomeList />, {
        preloadedState: populatedTestState,
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Part-time Job')).toBeInTheDocument();
        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
      });
    });
  });

  describe('frequency display', () => {
    it('displays weekly frequency with primary color', () => {
      renderWithProviders(<IncomeList />, {
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

      expect(screen.getByText('weekly')).toBeInTheDocument();
    });

    it('displays one-time frequency', () => {
      renderWithProviders(<IncomeList />, {
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

      expect(screen.getByText('one-time')).toBeInTheDocument();
    });
  });
});
