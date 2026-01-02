import { useCallback, useEffect, useState } from 'react';

interface NomeInputProps {
    valorInicial: string,
    id: string,
    editar: (value: string) => void,
    sairModoEdicao: () => void
}

export const NomeInput = ({valorInicial, id, editar, sairModoEdicao}: NomeInputProps) => {
    const [value, setValue] = useState<string>(valorInicial);
    
    const handleEditar = useCallback(() => {
        if(value !== valorInicial){
            editar(value);
        }
    }, [value, valorInicial]);

    useEffect(() => {
        const timer = setTimeout(() => {    
            handleEditar();
        }, 1000);

        return () => clearTimeout(timer);
    }, [value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    }, []);

    const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleEditar();
            sairModoEdicao();
        }
    }, [handleEditar, sairModoEdicao]);

    const onClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);
    
    
    return (
        <input 
            id={id}
            className='w-full'
            type="text"
            autoFocus
            onClick={onClick}
            onKeyDown={onInputKeyDown}
            value={value} 
            onChange={handleChange} 
            onBlur={sairModoEdicao}
            onMouseDownCapture={onClick}
        />
    )
}
