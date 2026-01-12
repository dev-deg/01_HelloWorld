import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import SavingsGoalForm from './SavingsGoalForm';

describe('SavingsGoalForm', () => {
  describe('rendering', () => {
    it('renders the form title in add mode', () => {
      renderWithProviders(<SavingsGoalForm />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Create Savings Goal' })).toBeInTheDocument();
    });

    it('renders all form fields', () => {
      renderWithProviders(<SavingsGoalForm />);

      expect(screen.getByLabelText(/goal name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current amount/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderWithProviders(<SavingsGoalForm />);

      expect(
        screen.getByRole('button', { name: /create savings goal/i })
      ).toBeInTheDocument();
    });

    it('sets default current amount to 0', () => {
      renderWithProviders(<SavingsGoalForm />);

      expect(screen.getByLabelText(/current amount/i)).toHaveValue(0);
    });

    it('sets default deadline to 90 days from now', () => {
      renderWithProviders(<SavingsGoalForm />);

      const deadlineInput = screen.getByLabelText(/deadline/i);
      const expectedDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      expect(deadlineInput).toHaveValue(expectedDate);
    });
  });

  describe('edit mode', () => {
    const existingGoal = {
      id: '123',
      name: 'Emergency Fund',
      targetAmount: 1000,
      currentAmount: 350,
      deadline: '2024-06-01T00:00:00.000Z',
      description: 'For unexpected expenses',
    };

    it('renders the edit dialog title in edit mode', () => {
      renderWithProviders(
        <SavingsGoalForm editMode existingGoal={existingGoal} />
      );

      expect(screen.getByText('Edit Savings Goal')).toBeInTheDocument();
    });

    it('populates form with existing goal data', () => {
      renderWithProviders(
        <SavingsGoalForm editMode existingGoal={existingGoal} />
      );

      expect(screen.getByDisplayValue('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('350')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-06-01')).toBeInTheDocument();
      expect(
        screen.getByDisplayValue('For unexpected expenses')
      ).toBeInTheDocument();
    });

    it('renders update button in edit mode', () => {
      renderWithProviders(
        <SavingsGoalForm editMode existingGoal={existingGoal} />
      );

      expect(
        screen.getByRole('button', { name: /update goal/i })
      ).toBeInTheDocument();
    });

    it('renders cancel button in edit mode', () => {
      renderWithProviders(
        <SavingsGoalForm editMode existingGoal={existingGoal} />
      );

      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('calls onClose when cancel is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      renderWithProviders(
        <SavingsGoalForm
          editMode
          existingGoal={existingGoal}
          onClose={onClose}
        />
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('form submission', () => {
    it('adds savings goal to store on valid submission', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalForm />);

      await user.type(screen.getByLabelText(/goal name/i), 'New Laptop');
      await user.type(screen.getByLabelText(/target amount/i), '800');

      await user.click(
        screen.getByRole('button', { name: /create savings goal/i })
      );

      await waitFor(() => {
        const state = store.getState();
        expect(state.savings.goals).toHaveLength(1);
        expect(state.savings.goals[0].name).toBe('New Laptop');
        expect(state.savings.goals[0].targetAmount).toBe(800);
      });
    });

    it('resets form after successful submission in add mode', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SavingsGoalForm />);

      await user.type(screen.getByLabelText(/goal name/i), 'New Laptop');
      await user.type(screen.getByLabelText(/target amount/i), '800');

      await user.click(
        screen.getByRole('button', { name: /create savings goal/i })
      );

      await waitFor(() => {
        expect(screen.getByLabelText(/goal name/i)).toHaveValue('');
        expect(screen.getByLabelText(/target amount/i)).toHaveValue(null);
      });
    });

    it('does not submit with empty name', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalForm />);

      await user.type(screen.getByLabelText(/target amount/i), '800');

      await user.click(
        screen.getByRole('button', { name: /create savings goal/i })
      );

      expect(store.getState().savings.goals).toHaveLength(0);
    });

    it('does not submit with zero target amount', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalForm />);

      await user.type(screen.getByLabelText(/goal name/i), 'Test Goal');
      await user.type(screen.getByLabelText(/target amount/i), '0');

      await user.click(
        screen.getByRole('button', { name: /create savings goal/i })
      );

      expect(store.getState().savings.goals).toHaveLength(0);
    });

    it('allows optional description', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalForm />);

      await user.type(screen.getByLabelText(/goal name/i), 'Test Goal');
      await user.type(screen.getByLabelText(/target amount/i), '500');
      await user.type(
        screen.getByLabelText(/description/i),
        'Test description'
      );

      await user.click(
        screen.getByRole('button', { name: /create savings goal/i })
      );

      await waitFor(() => {
        const state = store.getState();
        expect(state.savings.goals[0].description).toBe('Test description');
      });
    });
  });
});
