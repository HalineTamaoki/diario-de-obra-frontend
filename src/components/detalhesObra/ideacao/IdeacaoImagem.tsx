import { useCallback } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { removerLink } from '../../../features/ideacaoSlice';
import type { Ideia } from '../../../types/Ideia';
import { AcoesWithChildren } from '../../common/AcoesWithChildren';
import { IdeacaoImg } from './IdeacaoImg';

export const IdeacaoImagem = ({ideia}: {ideia: Ideia}) => {
    const dispach = useDispatch();
   
    const deletar = useCallback(() => {
        dispach(removerLink(ideia.id));
    }, [removerLink, ideia.id]);

    return (
        <AcoesWithChildren itens={[{id: `acoes-ideia-${ideia.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />}]}>
            <IdeacaoImg url={ideia.link} />
        </AcoesWithChildren>
    );
} 