import { useCallback, useEffect, useState } from 'react';

export const ComentarioInput = ({initialValue, alterarComentario, disabled}: {initialValue: string, alterarComentario: (novoComentario: string) => void, disabled?: boolean}) => {
    const [value, setValue] = useState<string>(initialValue);
    
    const handleEditar = useCallback(() => {
        if(value !== initialValue){
            alterarComentario(value);
        }
    }, [value, initialValue]);

    useEffect(() => {
        const timer = setTimeout(() => {  
            handleEditar();
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, [value]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return (
        <textarea
            value={value}
            rows={3}
            className='border border-(--blue)! w-full rounded-md p-2'
            onChange={e => setValue(e.target.value)}
            onBlur={handleEditar}
            disabled={disabled}
        />
    )
}
