import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { editarObra } from '../../features/obraSlice';
import type { Obra } from '../../types/Obra';
import { NomeInput } from '../common/NomeInput';

interface NomeObraInputProps {
    obra: Obra, 
    sairModoEdicao: () => void
}

export const NomeObraInput = ({obra, sairModoEdicao}: NomeObraInputProps) => {
    const dispach = useDispatch();

    const editar = useCallback((value: string) => {
        dispach(editarObra({id: obra.id, nome: value}));
    }, [obra.id]);

    return (
        <NomeInput
            id='editar-nome-obra-input'
            className='py-2.5'
            valorInicial={obra.nome}
            defaultValue='Nome da obra'
            editar={editar} 
            sairModoEdicao={sairModoEdicao}
        />
    )
}