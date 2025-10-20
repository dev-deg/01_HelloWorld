import React from 'react';
import type { TodoListProps } from '../../types/todo';
import TodoItem from '../TodoItem/TodoItem';
import styles from './TodoList.module.css';

// Todo List Component - display a list of todos
const TodoList: React.FC<TodoListProps> = ({todos, onDeleteTodo, onToggleTodo})=>{
  return (
    <div className={styles.todoList}>
      {//condition
      todos.length == 0 ? 
      
      //true
      (<p className={styles.emptyMessage}>No todos yet!</p>) :
      
      //false
      (todos.map(
        todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onDelete={onDeleteTodo}
            onToggle={onToggleTodo}
            />
        )
      )
    )}
    </div>
  );
}

export default TodoList;