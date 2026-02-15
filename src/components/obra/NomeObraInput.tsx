import { useCallback } from 'react';
import { mostrarNotificacao } from '../../features/notificacaoSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEditarObraMutation } from '../../services/obraApi';
import type { Obra } from '../../types/Obra';
import { NomeInput } from '../common/NomeInput';

interface NomeObraInputProps {
    obra: Obra, 
    sairModoEdicao: () => void
}

export const NomeObraInput = ({obra, sairModoEdicao}: NomeObraInputProps) => {
    const dispatch = useAppDispatch();
    const [editarObra] = useEditarObraMutation();

    const editar = useCallback((value: string) => {
        editarObra({id: obra.id, nome: value}).unwrap()
            .catch((error) => {
                dispatch(mostrarNotificacao({mensagem: error.data?.mensagem ?? 'Erro ao editar nome da obra.', variant: 'danger'}));
            })
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