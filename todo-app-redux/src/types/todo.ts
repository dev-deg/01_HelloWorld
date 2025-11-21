export type Priority = 'high' | 'medium' | 'low';
export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
};