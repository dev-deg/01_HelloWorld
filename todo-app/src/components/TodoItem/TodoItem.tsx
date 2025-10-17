import React from 'react';
import type { TodoItemProps } from '../../types/todo';
import styles from './TodoItem.module.css';

// Todo Item Component - displays invidiual todo items with a delete button
const TodoItem: React.FC<TodoItemProps> = ({todo, onDelete})=>{
  return (
    <div className={styles.todoItem}>
      <span>{todo.text}</span>
      <button className={styles.deleteButton} 
        onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;