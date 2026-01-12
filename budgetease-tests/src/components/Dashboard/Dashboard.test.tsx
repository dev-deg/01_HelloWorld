import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import Dashboard from './index';

describe('Dashboard', () => {
  describe('rendering', () => {
    it('renders the dashboard title', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      renderWithProviders(<Dashboard />);

      expect(
        screen.getByText('Your financial overview at a glance')
      ).toBeInTheDocument();
    });

    it('renders FinancialSummary component', () => {
      renderWithProviders(<Dashboard />);

      // Check for summary card titles
      expect(screen.getByText('Total Income')).toBeInTheDocument();
      expect(screen.getByText('Total Expenses')).toBeInTheDocument();
      expect(screen.getByText('Net Balance')).toBeInTheDocument();
      expect(screen.getByText('Total Savings')).toBeInTheDocument();
    });

    it('renders ExpenseChart component', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText('Expenses by Category')).toBeInTheDocument();
    });

    it('renders RecentActivity component', () => {
      renderWithProviders(<Dashboard />);

      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });
});
