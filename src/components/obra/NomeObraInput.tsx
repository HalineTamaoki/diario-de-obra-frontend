import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { editarObra } from '../../features/obraSlice';
import type { Obra } from '../../types/Obra';

export const NomeObraInput = ({obra, sairModoEdicao}: {obra: Obra, sairModoEdicao: () => void}) => {
    const [value, setValue] = useState<string>(obra.nome);
    const dispach = useDispatch();

    const editar = useCallback(() => {
        if(value !== obra.nome){
            dispach(editarObra({id: obra.id, nome: value}));
        }
    }, [value, obra.id]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        const timer = setTimeout(() => {    
            editar();
        }, 1000);

        return () => clearTimeout(timer);
    }, [editar]);


    const onInputKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            editar();
            sairModoEdicao();
        }
    }, [editar, sairModoEdicao]);

    const onClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
    }, []);

    return (
        <input 
            id='editar-nome-obra-input'
            className='w-full'
            type="text"
            autoFocus
            onClick={onClick}
            onKeyDown={onInputKeyDown}
            value={value} 
            onChange={onChange} 
            onBlur={sairModoEdicao}
        />
    )
}