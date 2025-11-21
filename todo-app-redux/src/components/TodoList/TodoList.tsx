import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectFilteredTodos } from '../../store/selectors';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';
 
const TodoList: React.FC = () => {
  // Get filtered todos from Redux store using selector
  // This selector automatically filters based on the current filter state
  const todos = useAppSelector(selectFilteredTodos);
 
  return (
    <div className={styles.todoList}>
      {todos.length === 0 ? (
        <p className={styles.emptyMessage}>No todos yet. Add one above!</p>
      ) : (
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
          />
        ))
      )}
    </div>
  );
};
 
export default TodoList;