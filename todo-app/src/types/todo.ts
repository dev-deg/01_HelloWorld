export type Priority = 'high' | 'medium' | 'low';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: Priority;
}

export interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export interface TodoListProps {
  todos: Todo[];
  onDeleteTodo: (id: number) => void;
  onToggleTodo: (id: number) => void;
  onEditTodo: (id: number, newText: string) => void;
}

export interface AddTodoFormProps {
  onAddTodo: (text: string, priority: Priority) => void;
}
