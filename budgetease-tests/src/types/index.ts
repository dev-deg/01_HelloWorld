/**
 * Core type definitions for BudgetEase application
 * These types define the shape of our application state and data models
 */

// Income source represents a single source of income for the student
export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'one-time';
  date: string; // ISO date string
}

// Expense category options for tracking spending
export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'books'
  | 'entertainment'
  | 'utilities'
  | 'other';

// Individual expense record
export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO date string
}

// Savings goal for tracking financial objectives
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  description?: string;
}

// Root state interface - represents the entire Redux store
export interface RootState {
  income: {
    sources: IncomeSource[];
  };
  expenses: {
    items: Expense[];
  };
  savings: {
    goals: SavingsGoal[];
  };
}
