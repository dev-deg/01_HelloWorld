import React, { useState } from 'react';
import type { AddTodoFormProps } from '../../types/todo';
import styles from './AddTodoForm.module.css';

// AddTodoForm Component - form for adding todos
const AddTodoForm: React.FC<AddTodoFormProps> = ({onAddTodo})=>{
    const [inputValue, setInputValue] = useState<string>('');

    const handleSubmit =(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //preventing a page refresh
        if(inputValue.trim()){
            onAddTodo(inputValue);
            setInputValue('');
        }
    }

    return(
        <form className={styles.form} onSubmit={handleSubmit}>
            <input className={styles.input} type='text' placeholder='Enter a new todo..' 
            onChange={(e) => setInputValue(e.target.value)}></input>

            <button className={styles.submitButton} type='submit'>Add</button>
        </form>
    )
}

export default AddTodoForm;