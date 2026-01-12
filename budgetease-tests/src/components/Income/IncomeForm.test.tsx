import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import IncomeForm from './IncomeForm';

describe('IncomeForm', () => {
  describe('rendering', () => {
    it('renders the form title in add mode', () => {
      renderWithProviders(<IncomeForm />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Add Income Source' })).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderWithProviders(<IncomeForm />);

      expect(screen.getByLabelText(/income source name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderWithProviders(<IncomeForm />);

      expect(
        screen.getByRole('button', { name: /add income source/i })
      ).toBeInTheDocument();
    });
  });

  describe('edit mode', () => {
    const existingIncome = {
      id: '123',
      name: 'Part-time Job',
      amount: 500,
      frequency: 'monthly' as const,
      date: '2024-01-15T00:00:00.000Z',
    };

    it('renders the edit dialog title in edit mode', () => {
      renderWithProviders(
        <IncomeForm editMode existingIncome={existingIncome} />
      );

      expect(screen.getByText('Edit Income Source')).toBeInTheDocument();
    });

    it('populates form with existing income data', () => {
      renderWithProviders(
        <IncomeForm editMode existingIncome={existingIncome} />
      );

      expect(screen.getByDisplayValue('Part-time Job')).toBeInTheDocument();
      expect(screen.getByDisplayValue('500')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    });

    it('renders update button in edit mode', () => {
      renderWithProviders(
        <IncomeForm editMode existingIncome={existingIncome} />
      );

      expect(
        screen.getByRole('button', { name: /update income/i })
      ).toBeInTheDocument();
    });

    it('renders cancel button in edit mode', () => {
      renderWithProviders(
        <IncomeForm editMode existingIncome={existingIncome} />
      );

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProviders(
        <IncomeForm
          editMode
          existingIncome={existingIncome}
          onClose={onClose}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    it('adds income to store on valid submission', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<IncomeForm />);

      // Fill in the form
      await user.type(
        screen.getByLabelText(/income source name/i),
        'Test Income'
      );
      await user.type(screen.getByLabelText(/amount/i), '1000');

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /add income source/i })
      );

      // Check that the income was added to the store
      await waitFor(() => {
        const state = store.getState();
        expect(state.income.sources).toHaveLength(1);
        expect(state.income.sources[0].name).toBe('Test Income');
        expect(state.income.sources[0].amount).toBe(1000);
      });
    });

    it('resets form after successful submission in add mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncomeForm />);

      // Fill in the form
      await user.type(
        screen.getByLabelText(/income source name/i),
        'Test Income'
      );
      await user.type(screen.getByLabelText(/amount/i), '1000');

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /add income source/i })
      );

      // Check that the form was reset
      await waitFor(() => {
        expect(screen.getByLabelText(/income source name/i)).toHaveValue('');
        expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
      });
    });

    it('does not submit with empty name', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<IncomeForm />);

      // Only fill amount, leave name empty
      await user.type(screen.getByLabelText(/amount/i), '1000');

      // Submit the form
      await user.click(
        screen.getByRole('button', { name: /add income source/i })
      );

      // Store should remain empty
      expect(store.getState().income.sources).toHaveLength(0);
    });

    it('does not submit with zero amount', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<IncomeForm />);

      await user.type(
        screen.getByLabelText(/income source name/i),
        'Test Income'
      );
      await user.type(screen.getByLabelText(/amount/i), '0');

      await user.click(
        screen.getByRole('button', { name: /add income source/i })
      );

      expect(store.getState().income.sources).toHaveLength(0);
    });
  });

  describe('frequency selection', () => {
    it('displays all frequency options', async () => {
      const user = userEvent.setup();
      renderWithProviders(<IncomeForm />);

      // Open the frequency dropdown
      await user.click(screen.getByLabelText(/frequency/i));

      // Check all options are present in the dropdown menu
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Weekly' })).toBeInTheDocument();
      });
      expect(screen.getByRole('option', { name: 'Monthly' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'One-time' })).toBeInTheDocument();
    });

    it('defaults to monthly frequency', () => {
      renderWithProviders(<IncomeForm />);

      // The select should show 'Monthly' by default (visible in the input)
      const frequencySelect = screen.getByLabelText(/frequency/i);
      expect(frequencySelect).toHaveTextContent('Monthly');
    });
  });
});
