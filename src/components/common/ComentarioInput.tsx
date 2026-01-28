import { useEffect, useState } from 'react';

export const ComentarioInput = ({initialValue, alterarComentario}: {initialValue: string, alterarComentario: (novoComentario: string) => void}) => {
    const [value, setValue] = useState<string>(initialValue);
    
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue])

    return (
        <textarea
            value={value}
            rows={3}
            className='border border-(--blue)! w-full rounded-md p-2'
            onChange={e => setValue(e.target.value)}
            onBlur={() => alterarComentario(value)}
        />
    )
}
