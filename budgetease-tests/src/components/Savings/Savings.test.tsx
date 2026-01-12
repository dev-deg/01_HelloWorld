import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, populatedTestState } from '../../test/testUtils';
import SavingsPage from './index';

describe('SavingsPage', () => {
  describe('rendering', () => {
    it('renders the page title', () => {
      renderWithProviders(<SavingsPage />);

      expect(screen.getByText('Savings Goals')).toBeInTheDocument();
    });

    it('renders the page description', () => {
      renderWithProviders(<SavingsPage />);

      expect(
        screen.getByText(
          'Set financial goals and track your progress towards achieving them.'
        )
      ).toBeInTheDocument();
    });

    it('renders the SavingsGoalForm component', () => {
      renderWithProviders(<SavingsPage />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Create Savings Goal' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /create savings goal/i })
      ).toBeInTheDocument();
    });

    it('displays empty state message when no goals exist', () => {
      renderWithProviders(<SavingsPage />);

      expect(
        screen.getByText(/no savings goals yet/i)
      ).toBeInTheDocument();
    });
  });

  describe('with existing goals', () => {
    it('renders savings goal cards when goals exist', () => {
      renderWithProviders(<SavingsPage />, {
        preloadedState: populatedTestState,
      });

      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
      expect(screen.getByText('New Laptop')).toBeInTheDocument();
    });

    it('does not show empty state when goals exist', () => {
      renderWithProviders(<SavingsPage />, {
        preloadedState: populatedTestState,
      });

      expect(
        screen.queryByText(/no savings goals yet/i)
      ).not.toBeInTheDocument();
    });
  });
});
