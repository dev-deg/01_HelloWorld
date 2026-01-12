import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/testUtils';
import SavingsGoalCard from './SavingsGoalCard';

describe('SavingsGoalCard', () => {
  const mockGoal = {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 350,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'For unexpected expenses',
  };

  describe('rendering', () => {
    it('renders the goal name', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    });

    it('renders the goal description', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      expect(screen.getByText('For unexpected expenses')).toBeInTheDocument();
    });

    it('renders current and target amounts', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      expect(screen.getByText('£350.00')).toBeInTheDocument();
      expect(screen.getByText('of £1000.00')).toBeInTheDocument();
    });

    it('renders action buttons', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      expect(
        screen.getByRole('button', { name: /add money/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /delete/i })
      ).toBeInTheDocument();
    });
  });

  describe('progress calculation', () => {
    it('calculates progress percentage correctly', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      // 350/1000 = 35%
      expect(screen.getByText('35.0%')).toBeInTheDocument();
    });

    it('caps progress at 100%', () => {
      const overfilledGoal = {
        ...mockGoal,
        currentAmount: 1500, // More than target
      };

      renderWithProviders(<SavingsGoalCard goal={overfilledGoal} />);

      expect(screen.getByText('100.0%')).toBeInTheDocument();
    });

    it('shows 0% when current amount is 0', () => {
      const emptyGoal = {
        ...mockGoal,
        currentAmount: 0,
      };

      renderWithProviders(<SavingsGoalCard goal={emptyGoal} />);

      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('deadline display', () => {
    it('shows days remaining when deadline is in future', () => {
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      // Should show "X days left"
      expect(screen.getByText(/days left/i)).toBeInTheDocument();
    });

    it('shows "Overdue" when deadline has passed', () => {
      const overdueGoal = {
        ...mockGoal,
        deadline: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      };

      renderWithProviders(<SavingsGoalCard goal={overdueGoal} />);

      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('deletes goal when delete button is clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalCard goal={mockGoal} />, {
        preloadedState: {
          income: { sources: [] },
          expenses: { items: [] },
          savings: { goals: [mockGoal] },
        },
      });

      await user.click(screen.getByRole('button', { name: /delete/i }));

      await waitFor(() => {
        expect(store.getState().savings.goals).toHaveLength(0);
      });
    });
  });

  describe('edit functionality', () => {
    it('opens edit dialog when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      await user.click(screen.getByRole('button', { name: /edit/i }));

      await waitFor(() => {
        expect(screen.getByText('Edit Savings Goal')).toBeInTheDocument();
      });
    });
  });

  describe('add money functionality', () => {
    it('opens add money dialog when add button is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      await user.click(screen.getByRole('button', { name: /add money/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/add money to emergency fund/i)
        ).toBeInTheDocument();
      });
    });

    it('adds money to goal when submitted', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProviders(<SavingsGoalCard goal={mockGoal} />, {
        preloadedState: {
          income: { sources: [] },
          expenses: { items: [] },
          savings: { goals: [mockGoal] },
        },
      });

      // Open add money dialog
      await user.click(screen.getByRole('button', { name: /add money/i }));

      // Wait for dialog to open and find amount input
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Find the amount input by its role
      const amountInput = screen.getByRole('spinbutton');
      await user.type(amountInput, '50');

      // Click Add Money button in dialog
      const addButton = screen.getByRole('button', { name: /^add money$/i });
      await user.click(addButton);

      // Check that amount was added
      await waitFor(() => {
        expect(store.getState().savings.goals[0].currentAmount).toBe(400);
      });
    });

    it('closes dialog when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders(<SavingsGoalCard goal={mockGoal} />);

      // Open dialog
      await user.click(screen.getByRole('button', { name: /add money/i }));

      // Click cancel
      await waitFor(async () => {
        await user.click(screen.getByRole('button', { name: /cancel/i }));
      });

      // Dialog should close
      await waitFor(() => {
        expect(
          screen.queryByText(/add money to emergency fund/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('goal without description', () => {
    it('renders without description', () => {
      const goalWithoutDescription = {
        id: '2',
        name: 'Simple Goal',
        targetAmount: 500,
        currentAmount: 100,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      };

      renderWithProviders(<SavingsGoalCard goal={goalWithoutDescription} />);

      expect(screen.getByText('Simple Goal')).toBeInTheDocument();
      expect(
        screen.queryByText('For unexpected expenses')
      ).not.toBeInTheDocument();
    });
  });
});
