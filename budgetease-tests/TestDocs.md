# BudgetEase Testing Documentation

This document provides comprehensive documentation for the unit testing setup in the BudgetEase application.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Project Structure](#project-structure)
3. [Configuration](#configuration)
4. [Running Tests](#running-tests)
5. [Test Utilities](#test-utilities)
6. [Component Tests](#component-tests)
7. [Redux Slice Tests](#redux-slice-tests)
8. [Utility Tests](#utility-tests)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Testing Stack

BudgetEase uses the following testing technologies:

| Package | Version | Purpose |
|---------|---------|---------|
| **Vitest** | ^4.0.16 | Fast, Vite-native test runner |
| **@vitest/ui** | ^4.0.16 | Browser-based test UI |
| **jsdom** | ^27.3.0 | DOM simulation for Node.js |
| **@testing-library/react** | ^16.3.1 | React component testing utilities |
| **@testing-library/jest-dom** | ^6.9.1 | Custom DOM matchers |
| **@testing-library/user-event** | ^14.6.1 | User interaction simulation |

### Why This Stack?

- **Vitest**: Native integration with Vite, fast execution, Jest-compatible API
- **Testing Library**: Encourages testing user behavior over implementation details
- **jsdom**: Provides a complete DOM API for testing React components

---

## Project Structure

```
src/
├── test/
│   ├── setup.ts              # Global test setup & mocks
│   └── testUtils.tsx         # Custom render functions & utilities
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.test.tsx
│   │   ├── FinancialSummary.test.tsx
│   │   ├── ExpenseChart.test.tsx
│   │   └── RecentActivity.test.tsx
│   ├── Expenses/
│   │   ├── Expenses.test.tsx
│   │   ├── ExpenseForm.test.tsx
│   │   └── ExpenseList.test.tsx
│   ├── Income/
│   │   ├── Income.test.tsx
│   │   ├── IncomeForm.test.tsx
│   │   └── IncomeList.test.tsx
│   └── Savings/
│       ├── Savings.test.tsx
│       ├── SavingsGoalForm.test.tsx
│       └── SavingsGoalCard.test.tsx
├── store/
│   └── slices/
│       ├── incomeSlice.test.ts
│       ├── expensesSlice.test.ts
│       └── savingsSlice.test.ts
└── utils/
    └── localStorage.test.ts
```

---

## Configuration

### vitest.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
});
```

### Key Configuration Options

| Option | Value | Description |
|--------|-------|-------------|
| `globals` | `true` | Enables global test functions (describe, it, expect) |
| `environment` | `jsdom` | Simulates browser DOM |
| `setupFiles` | `['./src/test/setup.ts']` | Runs before each test file |

---

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests with browser-based UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode Commands

When running `npm test`, you can use these keyboard shortcuts:

| Key | Action |
|-----|--------|
| `a` | Run all tests |
| `f` | Run only failed tests |
| `p` | Filter by filename |
| `t` | Filter by test name |
| `q` | Quit |

---

## Test Utilities

### Custom Render Function

The `renderWithProviders` function wraps components with necessary providers:

```typescript
import { renderWithProviders } from '../../test/testUtils';

// Basic usage
const { store } = renderWithProviders(<MyComponent />);

// With preloaded state
renderWithProviders(<MyComponent />, {
  preloadedState: {
    income: { sources: [...] },
    expenses: { items: [...] },
    savings: { goals: [...] },
  },
});
```

### Mock Data Factories

```typescript
import {
  createMockIncomeSource,
  createMockExpense,
  createMockSavingsGoal,
} from '../../test/testUtils';

// Create mock data with defaults
const income = createMockIncomeSource();

// Override specific properties
const expense = createMockExpense({ amount: 100, category: 'transport' });
```

### Predefined Test States

```typescript
import {
  defaultTestState,      // Empty state
  populatedTestState,    // State with sample data
} from '../../test/testUtils';
```

---

## Component Tests

### Testing Patterns

#### 1. Rendering Tests

```typescript
describe('rendering', () => {
  it('renders the component title', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});
```

#### 2. User Interaction Tests

```typescript
import userEvent from '@testing-library/user-event';

it('submits form on button click', async () => {
  const user = userEvent.setup();
  renderWithProviders(<MyForm />);

  await user.type(screen.getByLabelText(/name/i), 'Test');
  await user.click(screen.getByRole('button', { name: /submit/i }));

  // Assert results...
});
```

#### 3. Redux Integration Tests

```typescript
it('updates store on form submission', async () => {
  const user = userEvent.setup();
  const { store } = renderWithProviders(<MyForm />);

  await user.type(screen.getByLabelText(/amount/i), '100');
  await user.click(screen.getByRole('button', { name: /add/i }));

  await waitFor(() => {
    expect(store.getState().mySlice.items).toHaveLength(1);
  });
});
```

### Component Test Coverage

| Component | Tests | Coverage Areas |
|-----------|-------|----------------|
| **Dashboard** | 5 | Rendering, sub-component integration |
| **FinancialSummary** | 8 | Calculations, frequency handling |
| **ExpenseChart** | 5 | Empty state, data aggregation |
| **RecentActivity** | 7 | Sorting, limiting, formatting |
| **ExpenseForm** | 10 | Validation, submission, edit mode |
| **ExpenseList** | 6 | Display, delete, edit dialogs |
| **IncomeForm** | 10 | Validation, submission, edit mode |
| **IncomeList** | 6 | Display, delete, edit dialogs |
| **SavingsGoalForm** | 9 | Validation, defaults, edit mode |
| **SavingsGoalCard** | 12 | Progress, actions, dialogs |

---

## Redux Slice Tests

### Testing Reducers

```typescript
import myReducer, { myAction } from './mySlice';

describe('mySlice', () => {
  it('handles action correctly', () => {
    const initialState = { items: [] };
    const action = myAction({ id: '1', name: 'Test' });

    const result = myReducer(initialState, action);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe('Test');
  });
});
```

### Slice Test Coverage

| Slice | Actions Tested |
|-------|----------------|
| **incomeSlice** | addIncome, updateIncome, deleteIncome, loadIncome |
| **expensesSlice** | addExpense, updateExpense, deleteExpense, loadExpenses |
| **savingsSlice** | addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, addToSavingsGoal, loadSavings |

---

## Utility Tests

### localStorage Tests

Tests cover:
- Saving state to localStorage
- Loading state from localStorage
- Clearing localStorage
- Error handling for storage failures
- Invalid JSON handling

---

## Best Practices

### 1. Test Organization

```typescript
describe('ComponentName', () => {
  describe('rendering', () => {
    // Visual/rendering tests
  });

  describe('user interactions', () => {
    // Click, type, submit tests
  });

  describe('edge cases', () => {
    // Error states, empty states, etc.
  });
});
```

### 2. Use Testing Library Queries Correctly

| Priority | Query | Use Case |
|----------|-------|----------|
| 1 | `getByRole` | Accessible elements (buttons, links) |
| 2 | `getByLabelText` | Form inputs |
| 3 | `getByText` | Static text content |
| 4 | `getByTestId` | Last resort for dynamic content |

### 3. Async Testing

```typescript
// Always use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Use userEvent.setup() for user interactions
const user = userEvent.setup();
await user.click(button);
```

### 4. Avoid Implementation Details

```typescript
// Bad: Testing internal state
expect(component.state.isOpen).toBe(true);

// Good: Testing visible behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

---

## Troubleshooting

### Common Issues

#### 1. "Unable to find element" errors

```typescript
// Solution: Use findBy for async elements
const element = await screen.findByText('Loaded content');

// Or wrap in waitFor
await waitFor(() => {
  expect(screen.getByText('Loaded content')).toBeInTheDocument();
});
```

#### 2. Act warnings

```typescript
// Solution: Wrap state updates in act() or use waitFor
import { act } from '@testing-library/react';

await act(async () => {
  // trigger state update
});
```

#### 3. Mock function not being called

```typescript
// Ensure you're using vi.fn() from vitest
import { vi } from 'vitest';

const mockFn = vi.fn();
// Use vi.spyOn for method mocks
vi.spyOn(console, 'error').mockImplementation(() => {});
```

#### 4. ResizeObserver or matchMedia errors

These are handled in `src/test/setup.ts` with mocks:

```typescript
// Already configured in setup.ts
window.ResizeObserver = ResizeObserverMock;
window.matchMedia = vi.fn().mockImplementation(...);
```

---

## Test File Naming Convention

- Test files should be co-located with source files
- Use `.test.tsx` for component tests
- Use `.test.ts` for non-React files
- Example: `ExpenseForm.tsx` -> `ExpenseForm.test.tsx`

---

## Adding New Tests

1. Create test file next to the component/module
2. Import test utilities from `../../test/testUtils`
3. Use `renderWithProviders` for components that need Redux
4. Follow the `describe/it` pattern for organization
5. Run `npm test` to verify tests pass

---

## Continuous Integration

For CI pipelines, use:

```bash
npm run test:run
```

This runs tests once without watch mode, suitable for automated builds.

For coverage reports in CI:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage/` directory.
