import { describe, it, expect } from 'vitest';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import ExpenseList from './ExpenseList';

describe('ExpenseList', () => {
  describe('rendering', () => {
    it('displays empty state message when no expenses exist', () => {
      renderWithProviders(<ExpenseList />);

      expect(
        screen.getByText(/no expenses recorded yet/i)
      ).toBeInTheDocument();
    });

    it('renders expense items when expenses exist', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Bus Pass')).toBeInTheDocument();
      expect(screen.getByText('Textbooks')).toBeInTheDocument();
    });

    it('displays expense amounts with correct formatting', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('-£75.50')).toBeInTheDocument();
      expect(screen.getByText('-£45.00')).toBeInTheDocument();
      expect(screen.getByText('-£120.00')).toBeInTheDocument();
    });

    it('displays category chips', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('food')).toBeInTheDocument();
      expect(screen.getByText('transport')).toBeInTheDocument();
      expect(screen.getByText('books')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('sorts expenses by date with newest first', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      const cards = screen.getAllByRole('listitem');

      // Groceries (Jan 14) should be first, then Bus Pass (Jan 12), then Textbooks (Jan 8)
      expect(within(cards[0]).getByText('Groceries')).toBeInTheDocument();
      expect(within(cards[1]).getByText('Bus Pass')).toBeInTheDocument();
      expect(within(cards[2]).getByText('Textbooks')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('renders delete button for each expense', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      expect(deleteButtons).toHaveLength(3);
    });

    it('removes expense from store when delete is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      // Find and click the first delete button
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Check that the expense was removed
      await waitFor(() => {
        expect(store.getState().expenses.items).toHaveLength(2);
      });
    });
  });

  describe('edit functionality', () => {
    it('renders edit button for each expense', () => {
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons).toHaveLength(3);
    });

    it('opens edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      // Click the first edit button
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      // Check that the edit dialog appears
      await waitFor(() => {
        expect(screen.getByText('Edit Expense')).toBeInTheDocument();
      });
    });

    it('populates edit form with expense data', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExpenseList />, {
        preloadedState: populatedTestState,
      });

      // Click the first edit button (Groceries - newest)
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      // Check form is populated
      await waitFor(() => {
        expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
        expect(screen.getByDisplayValue('75.5')).toBeInTheDocument();
      });
    });
  });
});
