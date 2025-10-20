import React from 'react';
import type { TodoItemProps } from '../../types/todo';
import styles from './TodoItem.module.css';

// Todo Item Component - displays invidiual todo items with a delete button
const TodoItem: React.FC<TodoItemProps> = ({todo, onDelete, onToggle})=>{
  return (
    <div className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}>
      <div className = {styles.todoContent}>
        <input type="checkbox" className={styles.checkbox} checked={todo.completed} onChange={() => onToggle(todo.id)}/>
        <span className={`${styles.todoText} ${todo.completed ? styles.completedText : ''}`}>{todo.text}</span>
      </div>
      <button className={styles.deleteButton} 
        onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
};

export default TodoItem;