export interface Todo {
  id: number;
  text: string;
}

export interface TodoItemProps {
    todo: Todo;
    onDelete: (id: number) => void;
}

export interface TodoListProps {
    todos: Todo[];
    onDeleteTodo: (id: number) => void;
}

export interface AddTodoFormProps {
    onAddTodo: (text: string) => void;
}