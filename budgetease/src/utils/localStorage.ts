const STORAGE_KEY = 'budgetease_data';

export const saveToLocalStorage = (state: any): void => {
    try{
        const serializedState = JSON.stringify(state);
        localStorage.setItem(STORAGE_KEY, serializedState);
    }catch (error){
        console.error('Error loading data from localStorage' , error)
    }
}

export const loadFromLocalStorage = (): any => {
    try{
        const serializedState = localStorage.getItem(STORAGE_KEY);
        if (serializedState === null) return undefined;
        return JSON.parse(serializedState);
    }catch (error){
        console.error('Error loading data from localStorage' , error)
    }
}

export const clearLocalStorage =(): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    }catch (error){
        console.error('Error clearing localStorage' , error)
    }
}