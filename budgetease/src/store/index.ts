import { configureStore } from '@reduxjs/toolkit'
import incomeReducer from './slices/incomeSlice'
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

export const store = configureStore({
    reducer: {
        income: incomeReducer,
        //expenses: expensesReducer,
        //savings: savingsReducer,
    }
});


export type RootState = ReturnType<typeof store.getState>;

export type AddDispatch = typeof store.dispatch;

export const useAppDispatch: () => AddDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;