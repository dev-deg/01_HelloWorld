import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from './localStorage';

describe('localStorage utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as any).mockReset();
    (localStorage.setItem as any).mockReset();
    (localStorage.removeItem as any).mockReset();
  });

  describe('saveToLocalStorage', () => {
    it('saves state to localStorage', () => {
      const state = { income: { sources: [] } };

      saveToLocalStorage(state);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'budgetease_data',
        JSON.stringify(state)
      );
    });

    it('handles complex nested state', () => {
      const complexState = {
        income: {
          sources: [
            { id: '1', name: 'Job', amount: 1000, frequency: 'monthly' },
          ],
        },
        expenses: {
          items: [
            { id: '1', description: 'Food', amount: 50, category: 'food' },
          ],
        },
        savings: {
          goals: [
            { id: '1', name: 'Goal', targetAmount: 1000, currentAmount: 100 },
          ],
        },
      };

      saveToLocalStorage(complexState);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'budgetease_data',
        JSON.stringify(complexState)
      );
    });

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (localStorage.setItem as any).mockImplementation(() => {
        throw new Error('Storage full');
      });

      // Should not throw
      expect(() => saveToLocalStorage({ test: 'data' })).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('loadFromLocalStorage', () => {
    it('loads state from localStorage', () => {
      const savedState = { income: { sources: [] } };
      (localStorage.getItem as any).mockReturnValue(JSON.stringify(savedState));

      const result = loadFromLocalStorage();

      expect(localStorage.getItem).toHaveBeenCalledWith('budgetease_data');
      expect(result).toEqual(savedState);
    });

    it('returns undefined when no data exists', () => {
      (localStorage.getItem as any).mockReturnValue(null);

      const result = loadFromLocalStorage();

      expect(result).toBeUndefined();
    });

    it('handles errors gracefully and returns undefined', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (localStorage.getItem as any).mockImplementation(() => {
        throw new Error('Access denied');
      });

      const result = loadFromLocalStorage();

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('handles invalid JSON gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (localStorage.getItem as any).mockReturnValue('invalid json');

      const result = loadFromLocalStorage();

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('clearLocalStorage', () => {
    it('removes data from localStorage', () => {
      clearLocalStorage();

      expect(localStorage.removeItem).toHaveBeenCalledWith('budgetease_data');
    });

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (localStorage.removeItem as any).mockImplementation(() => {
        throw new Error('Access denied');
      });

      // Should not throw
      expect(() => clearLocalStorage()).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
