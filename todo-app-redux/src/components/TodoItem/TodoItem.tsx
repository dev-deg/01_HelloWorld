import React, { useState, useEffect, useRef } from 'react';
import type { Todo } from '../../types/todo';
import { useAppDispatch } from '../../store/hooks';
import { toggleTodo, editTodo, deleteTodo } from '../../store/todoSlice';
import styles from './TodoItem.module.css';
 
interface TodoItemProps {
  todo: Todo;
}
 
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  // Get dispatch function from Redux
  const dispatch = useAppDispatch();
 
  // Local component state for editing mode (temporary UI state)
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
 
  /**
   * Enter edit mode when user double-clicks the todo text
   */
  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };
 
  /**
   * Save the edited todo text
   * Dispatches editTodo action to Redux if text has changed
   */
  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      // Dispatch action to update todo in Redux store
      dispatch(editTodo({ id: todo.id, text: trimmedText }));
    }
    setIsEditing(false);
  };
 
  /**
   * Cancel editing and revert to original text
   */
  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };
 
  /**
   * Handle keyboard shortcuts while editing
   * - Enter: Save changes
   * - Escape: Cancel editing
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
 
  /**
   * Save changes when input loses focus
   */
  const handleInputBlur = () => {
    handleSave();
  };
 
  /**
   * Toggle todo completion status
   * Dispatches toggleTodo action to Redux
   */
  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };
 
  /**
   * Delete this todo
   * Dispatches deleteTodo action to Redux
   */
  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };
 
  return (
    <div className={`${styles.todoItem} ${styles[todo.priority]} ${todo.completed ? styles.completed : ''}`}>
      <div className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
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
        onClick={handleDelete}
        className={styles.deleteButton}
      >
        Delete
      </button>
    </div>
  );
};
 
export default TodoItem;