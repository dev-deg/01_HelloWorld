/**
 * LocalStorage Utility
 *
 * Handles persisting Redux state to browser localStorage
 * This ensures data persists across page refreshes
 */

const STORAGE_KEY = 'budgetease_data';

/**
 * Save state to localStorage
 * @param state - The state object to save
 */
export const saveToLocalStorage = (state: any): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load state from localStorage
 * @returns The saved state or undefined if nothing is saved
 */
export const loadFromLocalStorage = (): any => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return undefined;
  }
};

/**
 * Clear all data from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
