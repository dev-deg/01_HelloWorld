/*
Selectors are functionsthat know how to extract specific pieces of information form the redux store state.
They help keep components clean by encapsulating the logicfor derving data from state.

Benefits of using selectors:
1.Encapsulation - Components don't need to know the exact state structure
2. Reusability - Same selector can be used in multiple components
3. Memoization - Can be optimised with libraries like Reselect
4. Testability - Easy to test in isolation
*/

import type {RootState} from './store';


export const selectAllTodos = (state: RootState) => state.todos.todos;

export const selectFilter = (state: RootState) => state.todos.filter;

export const selectFilteredTodos = (state: RootState) => {
    const todos = selectAllTodos(state);
    const filter = selectFilter(state);

    switch (filter){
        case 'active':
            return todos.filter(todo=> !todo.completed);
        case 'completed':
            return todos.filter(todo=> todo.completed);
        case 'all':
        default:
            return todos;
    }
}

export const selectActiveTodoCount = (state: RootState) => {
    return selectAllTodos(state).filter(todo=> !todo.completed).length;
}

export const selectCompletedTodoCount = (state: RootState) => {
    return selectAllTodos(state).filter(todo=> todo.completed).length;
}

export const selectTotalTodoCount = (state: RootState) => {
    return selectAllTodos(state).length;
}