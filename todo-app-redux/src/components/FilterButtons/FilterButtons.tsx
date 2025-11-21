import React from 'react';
import styles from './FilterButtons.module.css';

import type { FilterType } from '../../types/todo';
import {useAppDispatch, useAppSelector} from "../../store/hooks"
import { setFilter } from '../../store/todoSlice';
import { selectFilter } from '../../store/selectors';


interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}


const FilterButtons: React.FC = () => {
    const dispatch = useAppDispatch();

    const currentFilter = useAppSelector(selectFilter);

    const handleFilterChange = (filter: FilterType) => {
      dispatch(setFilter(filter))
    }


  return (
    <div className={styles.filterButtons}>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
        onClick={() => handleFilterChange('all')}
      >
        All
      </button>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'active' ? styles.active : ''}`}
        onClick={() => handleFilterChange('active')}
      >
        Active
      </button>
      <button 
        className={`${styles.filterButton} ${currentFilter === 'completed' ? styles.active : ''}`}
        onClick={() => handleFilterChange('completed')}
      >
        Completed
      </button>
    </div>
  );
};

export default FilterButtons;
