import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { addObra } from '../../features/obraSlice';
import { BsPlus } from 'react-icons/bs';

export const AdicionarObraInput = () => {
    const dispach = useDispatch();
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    const adicionarObra = useCallback(() => {
        if(inputValue === '') return;

        setInputValue('');
        dispach(addObra({ nome: inputValue, porcentagem: Math.random() * 100 }));
    }, [dispach, inputValue]);

    const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            adicionarObra();
            inputRef.current?.blur();
        }
    }, [adicionarObra]);

    return (
        <div 
            id='adicionar-obra-input-wrapper' 
            className="w-full flex md:w-[70%] lg:w-1/2 pl-4 py-1 rounded-lg" 
            style={{ borderColor: 'var(--grey)', borderWidth: '1px', borderStyle: 'solid'}}
        >
            <input 
                type="text"
                className="w-full" 
                aria-label="Adicionar nova obra" 
                placeholder="Adicionar nova obra"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                id='adicionar-obra-input'
                onKeyDown={onInputKeyDown}
                ref={inputRef}
            />
            <button
                className="btn"
                type="button"
                onClick={adicionarObra}
                id='adicionar-obra-btn'
            >
                <BsPlus className='text-lg'/>
            </button>
        </div>
    )
}
