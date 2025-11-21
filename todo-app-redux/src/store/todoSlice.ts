/*
Todo Slice - Redux Toolkit Slice for managing todo state

A slice is a collection of Redux reducer logic and actions for a single feature
Redux Toolkit's createSlice automatically generates action creators and action types
*/

import {createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {Todo, Priority, FilterType} from '../types/todo'

//The shape of our todo state in redux
//This interface defines what data we'll store in our Redux store
interface TodoState {
    todos: Todo[];
    filter: FilterType;
}

//Initial state for the todo slice
//This is the starting point for our redux state when the app loads
const initialState: TodoState = {
    todos: [],
    filter: 'all',
}

/*
This create slice is a function that accepts a name, initial state and reducers
It automatically gnerates action creators with the same name as the reducer function
*/
const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        //Add a new todo to the list
        addTodo: (state, action: PayloadAction<{text: string, priority: Priority}>) => {
            const newTodo: Todo = {
                id: Date.now(),
                text: action.payload.text,
                completed: false,
                priority: action.payload.priority
            }
            //NOTE {IMPORTANT}: RTK uses Immer library internally which allows us to write "mutating" logic that actually produces immutable updates
            state.todos.push(newTodo);
        },
        deleteTodo: (state, action: PayloadAction<number>) => {
            //Filter out the todo with the matching id
            state.todos = state.todos.filter (todo => todo.id !== action.payload);
        },
        toggleTodo: (state, action: PayloadAction<number>) => {
            //Finding the todo and toggling its completed status
            const todo = state.todos.find(todo => todo.id == action.payload);
            if (todo){
                todo.completed = !todo.completed;
            }
        },
        editTodo: (state, action: PayloadAction<{id: number, text: string}>) => {
            //Finding the todo and update its text
            const todo = state.todos.find(todo => todo.id == action.payload.id);
            if (todo){
                todo.text = action.payload.text;
            }
        },
        clearCompleted: (state) => {
            state.todos = state.todos.filter(todo => !todo.completed);
        },
        setFilter: (state, action: PayloadAction<FilterType>) => {
            state.filter = action.payload;
        }
    }
});

//Export action creations which are automatically gnerated by createSlice based on the reduces we defined

export const {
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    clearCompleted,
    setFilter
} = todoSlice.actions;

//Export the reducer
export default todoSlice.reducer;