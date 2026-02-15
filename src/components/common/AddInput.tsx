import React, { useCallback, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { BsPlus } from 'react-icons/bs';
import { useAppDispatch } from '../../hooks/useAppDispatch';

interface AddInputProps {
    add: (value: string) => void, 
    id: string, 
    placeholder: string, 
    className?: string,
    loading?: boolean,
}

export const AddInput = ({add, id, placeholder, className, loading}: AddInputProps) => {
    const dispach = useAppDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const adicionar = useCallback(() => {
        if(inputValue === '') return;

        setInputValue('');
        add(inputValue);
    }, [dispach, inputValue]);

    const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            adicionar();
            inputRef.current?.blur();
        }
    }, [adicionar]);

    return (
        <div 
            id={`${id}-wrapper`} 
            className={`w-full flex pl-4 py-1 rounded-lg mb-3 ${className}`} 
            style={{ borderColor: 'var(--grey)', borderWidth: '1px', borderStyle: 'solid'}}
        >
            <input 
                type="text"
                className="w-full" 
                aria-label={placeholder}
                placeholder={placeholder}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                id={`${id}-input`} 
                onKeyDown={onInputKeyDown}
                ref={inputRef}
            />
            <button
                className="btn"
                type="button"
                onClick={adicionar}
                id={`${id}-btn`} 
                disabled={loading}
            >
                {loading ? <Spinner className='text-(--gray) border-2' size='sm'/>: <BsPlus className='text-lg'/>}
            </button>
        </div>
    )
}
