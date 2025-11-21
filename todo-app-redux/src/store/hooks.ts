import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from'./store';

// CustomHooks

//This is a typed version of useDispatch
//Typescript will autocomplete and type-check the actions that you dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

//This hook allows you to extract data from the redux store stater withfull 
// typescript support for the state shape
export const useAppSelector = useSelector.withTypes<RootState>();