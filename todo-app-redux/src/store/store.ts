import {configureStore} from "@reduxjs/toolkit";
import todoReducer from './todoSlice'

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    }
});


//These types are derived from the store itself, ensuring type safety throughout the application

/*
RootState type - represents the complete state tree inferred from the store's reducer

AppDispatch type - represents the store's dispatchfunction that includes the types of all possible actions
*/

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;