import React, { useState } from 'react';
import { Todo, Priority } from './types/todo';
import AddTodoForm from './components/AddTodoForm/AddTodoForm';
import TodoList from './components/TodoList/TodoList';
import FilterButtons from './components/FilterButtons/FilterButtons';
import styles from './App.module.css';

type FilterType = 'all' | 'active' | 'completed';

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = (text: string, priority: Priority): void => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false,
      priority: priority
    };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number): void => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id: number, newText: string): void => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const clearCompleted = (): void => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Derive counters from todos array
  const totalTodos = todos.length;
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  // Filter todos based on current filter state
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>My Todo App</h1>
      
      <AddTodoForm onAddTodo={addTodo} />
      
      <FilterButtons currentFilter={filter} onFilterChange={setFilter} />
      
      <TodoList todos={filteredTodos} onDeleteTodo={deleteTodo} onToggleTodo={toggleTodo} onEditTodo={editTodo} />
      
      <div className={styles.footer}>
        <div className={styles.counters}>
          <span className={styles.counter}>Total: {totalTodos}</span>
          <span className={styles.counter}>Active: {activeTodos}</span>
          <span className={styles.counter}>Completed: {completedTodos}</span>
        </div>
        {completedTodos > 0 && (
          <button onClick={clearCompleted} className={styles.clearButton}>
            Clear Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoApp;