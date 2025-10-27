import React from 'react';
import styles from './FilterButtons.module.css';

type FilterType = 'all' | 'active' | 'completed';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ currentFilter, onFilterChange }) => {
  return (
    <div className={styles.filterButtons}>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'active' ? styles.active : ''}`}
        onClick={() => onFilterChange('active')}
      >
        Active
      </button>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'completed' ? styles.active : ''}`}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default FilterButtons;
