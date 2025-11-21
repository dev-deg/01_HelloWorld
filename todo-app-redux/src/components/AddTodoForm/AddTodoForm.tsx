import React, { useState } from 'react';
import type { Priority } from '../../types/todo';
import styles from './AddTodoForm.module.css';

import {useAppDispatch} from "../../store/hooks"
import { addTodo } from '../../store/todoSlice';

const AddTodoForm: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');

  const dispatch = useAppDispatch();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {

      dispatch(addTodo({
        text: inputValue,
        priority: priority
      }));

      setInputValue('');
      setPriority('medium'); // Reset to default
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
      <select 
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className={styles.prioritySelect}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
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