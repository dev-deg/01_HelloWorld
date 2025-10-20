import React, {useState} from 'react';
import type { Todo } from './types/todo';
import AddTodoForm from './components/AddTodoForm/AddTodoForm';
import TodoList from './components/TodoList/TodoList';
import styles from './App.module.css';

//Main App Component
const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text:string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false
    }
    setTodos([... todos, newTodo]) //Very important to instantiatea new array using spread operator
  }

  const deleteTodo = (id: number) => setTodos(todos.filter(todo => todo.id !== id));

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? {... todo, completed: !todo.completed} : todo)));
  };

  return(
    <div className={styles.app}>
      <h1 className={styles.title}>My Awesome TodoApp</h1>
      <AddTodoForm onAddTodo={addTodo}/>
      <TodoList todos={todos} onDeleteTodo={deleteTodo} onToggleTodo={toggleTodo}/>
      <div className={styles.footer}>Total todos: {todos.length}</div>
    </div>
  )
}

export default TodoApp;