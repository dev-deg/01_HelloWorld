import React, { useState, useEffect, useRef } from 'react';
import { TodoItemProps } from '../../types/todo';
import styles from './TodoItem.module.css';

const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleInputBlur = () => {
    handleSave();
  };

  return (
    <div className={`${styles.todoItem} ${styles[todo.priority]} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className={styles.checkbox}
        />
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            className={styles.editInput}
          />
        ) : (
          <span 
            className={`${styles.todoText} ${todo.completed ? styles.completedText : ''}`}
            onDoubleClick={handleDoubleClick}
          >
            {todo.text}
          </span>
        )}
      </div>
      <button 
        onClick={() => onDelete(todo.id)}
        className={styles.deleteButton}
      >
        Delete
      </button>
    </div>
  );
};

export default TodoItem;