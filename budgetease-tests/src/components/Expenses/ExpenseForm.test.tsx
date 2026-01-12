import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import ExpenseForm from './ExpenseForm';

describe('ExpenseForm', () => {
  describe('rendering', () => {
    it('renders the form title in add mode', () => {
      renderWithProviders(<ExpenseForm />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Add Expense' })).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderWithProviders(<ExpenseForm />);

      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderWithProviders(<ExpenseForm />);

      expect(
        screen.getByRole('button', { name: /add expense/i })
      ).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    const existingExpense = {
      id: '123',
      description: 'Groceries',
      amount: 75.5,
      category: 'food' as const,
      date: '2024-01-15T00:00:00.000Z',
    };

    it('renders the edit dialog title in edit mode', () => {
      renderWithProviders(
        <ExpenseForm editMode existingExpense={existingExpense} />
      );

      expect(screen.getByText('Edit Expense')).toBeInTheDocument();
    });

    it('populates form with existing expense data', () => {
      renderWithProviders(
        <ExpenseForm editMode existingExpense={existingExpense} />
      );

      expect(screen.getByDisplayValue('Groceries')).toBeInTheDocument();
      expect(screen.getByDisplayValue('75.5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    });

    it('renders update button in edit mode', () => {
      renderWithProviders(
        <ExpenseForm editMode existingExpense={existingExpense} />
      );

      expect(
        screen.getByRole('button', { name: /update expense/i })
      ).toBeInTheDocument();
    });

    it('renders cancel button in edit mode', () => {
      renderWithProviders(
        <ExpenseForm editMode existingExpense={existingExpense} />
      );

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProviders(
        <ExpenseForm
          editMode
          existingExpense={existingExpense}
          onClose={onClose}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    it('adds expense to store on valid submission', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ExpenseForm />);

      // Fill in the form
      await user.type(screen.getByLabelText(/description/i), 'Test Expense');
      await user.type(screen.getByLabelText(/amount/i), '50');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Check that the expense was added to the store
      await waitFor(() => {
        const state = store.getState();
        expect(state.expenses.items).toHaveLength(1);
        expect(state.expenses.items[0].description).toBe('Test Expense');
        expect(state.expenses.items[0].amount).toBe(50);
      });
    });

    it('resets form after successful submission in add mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExpenseForm />);

      // Fill in the form
      await user.type(screen.getByLabelText(/description/i), 'Test Expense');
      await user.type(screen.getByLabelText(/amount/i), '50');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Check that the form was reset
      await waitFor(() => {
        expect(screen.getByLabelText(/description/i)).toHaveValue('');
        expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
      });
    });

    it('does not submit with empty description', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ExpenseForm />);

      // Only fill amount, leave description empty
      await user.type(screen.getByLabelText(/amount/i), '50');

      // Submit the form
      await user.click(screen.getByRole('button', { name: /add expense/i }));

      // Store should remain empty
      expect(store.getState().expenses.items).toHaveLength(0);
    });

    it('does not submit with zero or negative amount', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<ExpenseForm />);

      await user.type(screen.getByLabelText(/description/i), 'Test');
      await user.type(screen.getByLabelText(/amount/i), '0');

      await user.click(screen.getByRole('button', { name: /add expense/i }));

      expect(store.getState().expenses.items).toHaveLength(0);
    });
  });

  describe('category selection', () => {
    it('displays all category options', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ExpenseForm />);

      // Open the category dropdown by clicking on the select element
      const categorySelect = screen.getByLabelText(/category/i);
      await user.click(categorySelect);

      // Check all categories are present in the dropdown menu
      // Using getAllByRole to find menu items in the MUI dropdown
      await waitFor(() => {
        expect(screen.getByRole('option', { name: /food/i })).toBeInTheDocument();
      });
      expect(screen.getByRole('option', { name: /transport/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /accommodation/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /books/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /entertainment/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /utilities/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
    });
  });
});
