export type Frequency = 'weekly'| 'monthly' | 'one-time';

export interface IncomeSource {
    id: string;
    name: string;
    amount: number;
    frequency: Frequency;
    date: string;
}

export type ExpenseCategory = 'food' | 'transportation' | 'rent' | 'entertainment' | 'other'
export interface Expense {
    id: string;
    description: string;
    amount: number;
    frequency: Frequency;
    expense: ExpenseCategory;
    date: string;
}

export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string
    description?: string
}

export interface RootState {
    income : {
        sources: IncomeSource[];
    };
    expenses : {
        items: Expense[];
    };
    savings : {
        goals: SavingsGoal[];
    }
}