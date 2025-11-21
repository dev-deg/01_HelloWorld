/**
* Main App Component
*
* This is the root component of our todo application.
* With Redux, this component becomes much simpler - it just renders the UI structure.
* All state management is handled by Redux, and child components connect to the store directly.
*
* Key Redux Concepts Demonstrated:
* - Using Redux selectors to read state
* - Dispatching actions to update state
* - Derived/computed values from selectors
*/
 
import React from 'react';
import AddTodoForm from './components/AddTodoForm/AddTodoForm';
import TodoList from './components/TodoList/TodoList';
import FilterButtons from './components/FilterButtons/FilterButtons';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectActiveTodoCount, selectCompletedTodoCount, selectTotalTodoCount } from './store/selectors';
import { clearCompleted } from './store/todoSlice';
import styles from './App.module.css';
 
const TodoApp: React.FC = () => {
  // Get dispatch function to send actions to Redux store
  const dispatch = useAppDispatch();
  
  // Select data from Redux store using selectors
  // These selectors automatically recalculate when the underlying state changes
  const totalTodos = useAppSelector(selectTotalTodoCount);
  const activeTodos = useAppSelector(selectActiveTodoCount);
  const completedTodos = useAppSelector(selectCompletedTodoCount);
 
  /**
   * Handle clearing completed todos
   * Dispatches the clearCompleted action to Redux
   */
  const handleClearCompleted = () => {
    dispatch(clearCompleted());
  };
 
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>My Todo App (Redux Edition)</h1>
      
      {/* Form to add new todos - connects to Redux internally */}
      <AddTodoForm />
      
      {/* Filter buttons - connects to Redux internally */}
      <FilterButtons />
      
      {/* Todo list - connects to Redux internally */}
      <TodoList />
      
      {/* Footer with statistics and clear button */}
      <div className={styles.footer}>
        <div className={styles.counters}>
          <span className={styles.counter}>Total: {totalTodos}</span>
          <span className={styles.counter}>Active: {activeTodos}</span>
          <span className={styles.counter}>Completed: {completedTodos}</span>
        </div>
        {completedTodos > 0 && (
          <button onClick={handleClearCompleted} className={styles.clearButton}>
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
};
 
export default TodoApp;