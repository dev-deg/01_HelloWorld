import React from 'react';
import { TodoListProps } from '../../types/todo';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';

const TodoList: React.FC<TodoListProps> = ({ todos, onDeleteTodo, onToggleTodo, onEditTodo }) => {
  return (
    <div className={styles.todoList}>
      {todos.length === 0 ? (
        <p className={styles.emptyMessage}>No todos yet. Add one above!</p>
      ) : (
        todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onDelete={onDeleteTodo}
            onToggle={onToggleTodo}
            onEdit={onEditTodo}
          />
        ))
      )}
    </div>
  );
};

export default TodoList;