import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editarComentario } from '../../../features/execucaoSlice';

export const ComentarioInput = ({initialValue}: {initialValue: string}) => {
    const [value, setValue] = useState<string>(initialValue);
    const dispatch = useDispatch();
    
    const alterarComentario = useCallback(() => {
        if(value !== initialValue){
            dispatch(editarComentario(value));
        }
    }, [value, initialValue, editarComentario]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue])

    return (
        <textarea
            value={value}
            rows={3}
            className='border border-(--blue)! w-full rounded-md p-2'
            onChange={e => setValue(e.target.value)}
            onBlur={alterarComentario}
        />
    )
}
