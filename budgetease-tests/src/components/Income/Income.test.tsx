import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/testUtils';
import IncomePage from './index';

describe('IncomePage', () => {
  describe('rendering', () => {
    it('renders the page title', () => {
      renderWithProviders(<IncomePage />);

      expect(screen.getByText('Income Sources')).toBeInTheDocument();
    });

    it('renders the page description', () => {
      renderWithProviders(<IncomePage />);

      expect(
        screen.getByText(
          'Track your stipend, apprenticeship income, and other sources of money.'
        )
      ).toBeInTheDocument();
    });

    it('renders the IncomeForm component', () => {
      renderWithProviders(<IncomePage />);

      // The card title appears as a heading variant
      expect(screen.getByRole('heading', { name: 'Add Income Source' })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add income source/i })
      ).toBeInTheDocument();
    });

    it('renders the IncomeList component', () => {
      renderWithProviders(<IncomePage />);

      // In empty state, should show empty message
      expect(
        screen.getByText(/no income sources yet/i)
      ).toBeInTheDocument();
    });
  });
});
