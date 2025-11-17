# Todo App - React + TypeScript Learning Project

A comprehensive Todo application built with React, TypeScript, and CSS Modules to demonstrate modern React development patterns and JavaScript concepts.

## 📁 File Structure & React's Unidirectional Data Flow

```
src/
├── main.tsx                 # Application entry point
├── App.tsx                  # Main component (state container)
├── App.module.css          # Global app styles
├── types/
│   └── todo.ts             # TypeScript interfaces
└── components/
    ├── AddTodoForm/
    │   ├── AddTodoForm.tsx
    │   └── AddTodoForm.module.css
    ├── TodoList/
    │   ├── TodoList.tsx
    │   └── TodoList.module.css
    └── TodoItem/
        ├── TodoItem.tsx
        └── TodoItem.module.css
```

### How This Fits React's Unidirectional Data Flow:

1. **State Management**: The main `App.tsx` component holds all the application state (`todos` array)
2. **Data Down**: State is passed down as props to child components (`TodoList`, `AddTodoForm`)
3. **Events Up**: Child components communicate back to parent through callback functions (`onAddTodo`, `onDeleteTodo`)
4. **Single Source of Truth**: All data flows from the top-level component down through the component tree

```
App (State: todos[]) 
├── AddTodoForm (receives: onAddTodo callback)
└── TodoList (receives: todos, onDeleteTodo)
    └── TodoItem (receives: todo, onDelete)
```

## 🚀 Advanced JavaScript Concepts Explained

### 1. Arrow Functions

**Arrow Function (ES6+):**
```javascript
const addTodo = (text) => {
  // function body
};
```

**Traditional Function Equivalent:**
```javascript
function addTodo(text) {
  // function body
}
```

**Key Differences:**
- Arrow functions don't have their own `this` binding
- More concise syntax
- Implicit return for single expressions: `const double = x => x * 2`

### 2. Ternary Operators

**Ternary Operator:**
```javascript
{todos.length === 0 ? (
  <p>No todos yet. Add one above!</p>
) : (
  // render todos
)}
```

**If/Else Equivalent:**
```javascript
if (todos.length === 0) {
  return <p>No todos yet. Add one above!</p>;
} else {
  // render todos
}
```

**Syntax:** `condition ? valueIfTrue : valueIfFalse`

### 3. Array.map()

Transforms each element in an array and returns a new array:

```javascript
todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} onDelete={onDeleteTodo} />
))
```

**What it does:** Creates a new TodoItem component for each todo in the array.

### 4. Array.filter()

Creates a new array with elements that pass a test:

```javascript
setTodos(todos.filter(todo => todo.id !== id));
```

**What it does:** Creates a new array excluding the todo with the matching ID (effectively deleting it).

### 5. Spread Operator (...)

**In our code:**
```javascript
setTodos([...todos, newTodo]);
```

**What it does:**
- `...todos` spreads all existing todos into a new array
- Then adds `newTodo` at the end
- Creates a completely new array (React needs this for state updates)

**Without spread (WRONG for React):**
```javascript
todos.push(newTodo); // Mutates existing array - React won't detect change
```

### 6. className vs class

**Use `className`:**
```jsx
<div className={styles.todoItem}>Content</div>
```

**Why not `class`:**
- `class` is a reserved keyword in JavaScript (used for ES6 classes)
- JSX is JavaScript, so it uses `className` to avoid conflicts
- React converts `className` to `class` in the final HTML

### 7. React.FC and React.FormEvent

**React.FC (Function Component):**
```typescript
const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete }) => {
  // component logic
};
```
- TypeScript type for React functional components
- Provides proper typing for props
- Includes `children` prop automatically

**React.FormEvent:**
```typescript
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```
- TypeScript type for form submission events
- Ensures type safety when handling form events

## 🎨 CSS Modules Setup & Benefits

### Why CSS Modules?

1. **Scoped Styles**: Each component's styles are automatically scoped
2. **No Global Conflicts**: Class names are unique per module
3. **Maintainability**: Styles live next to their components
4. **Type Safety**: With TypeScript, get autocomplete for class names

### How It Works:

**CSS Module (TodoItem.module.css):**
```css
.todoItem {
  display: flex;
  justify-content: space-between;
}

.deleteButton {
  background-color: #ff4444;
}
```

**Component Usage:**
```tsx
import styles from './TodoItem.module.css';

<div className={styles.todoItem}>
  <button className={styles.deleteButton}>Delete</button>
</div>
```

**Generated HTML:**
```html
<div class="TodoItem_todoItem__abc123">
  <button class="TodoItem_deleteButton__def456">Delete</button>
</div>
```

## 📚 Essential React Concepts for New Developers

### 1. State vs Props

**State**: Data that belongs to and is managed by a component
```typescript
const [todos, setTodos] = useState<Todo[]>([]);
```

**Props**: Data passed from parent to child component
```typescript
interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
}
```

### 2. Controlled Components

React controls the form input value:
```typescript
const [inputValue, setInputValue] = useState<string>('');

<input
  value={inputValue}                           // React controls the value
  onChange={(e) => setInputValue(e.target.value)} // Update on change
/>
```

### 3. Event Handling

Always use functions, not function calls:
```typescript
// ✅ Correct - passes function reference
<button onClick={() => onDelete(todo.id)}>Delete</button>

// ❌ Wrong - calls function immediately
<button onClick={onDelete(todo.id)}>Delete</button>
```

### 4. Key Prop in Lists

Always provide unique keys when rendering lists:
```typescript
{todos.map(todo => (
  <TodoItem key={todo.id} todo={todo} /> // key helps React track items
))}
```

### 5. Immutable State Updates

Never mutate state directly:
```typescript
// ✅ Correct - creates new array
setTodos([...todos, newTodo]);

// ❌ Wrong - mutates existing array
todos.push(newTodo);
setTodos(todos);
```

### 6. TypeScript Benefits

- **Catch errors early**: Type checking at compile time
- **Better IDE support**: Autocomplete, refactoring
- **Self-documenting code**: Interface definitions show expected data shape
- **Safer refactoring**: TypeScript will flag breaking changes

### 7. Component Composition

Break UI into small, reusable components:
- Each component has a single responsibility
- Props make components flexible and reusable
- Easier to test and maintain

### 8. React DevTools

Install React Developer Tools browser extension to:
- Inspect component hierarchy
- View props and state
- Debug performance issues

## 🛠️ Development Setup

This project uses:
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and better developer experience
- **CSS Modules**: Scoped styling solution
- **React 18**: Latest React features including concurrent rendering

## 🚀 Getting Started

```bash
npm install
npm run dev
```
