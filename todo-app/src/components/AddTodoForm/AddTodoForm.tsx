import React, { useState } from 'react';
import { AddTodoFormProps } from '../../types/todo';
import styles from './AddTodoForm.module.css';

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter a new todo..."
        className={styles.input}
      />
      <button 
        type="submit"
        className={styles.submitButton}
      >
        Add
      </button>
    </form>
  );
};

export default AddTodoForm;