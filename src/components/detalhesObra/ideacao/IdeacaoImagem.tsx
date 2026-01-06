import { useCallback } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { removerLink } from '../../../features/ideacaoSlice';
import type { Ideia } from '../../../types/Ideia';
import { AcoesWithChildren } from '../../common/AcoesWithChildren';
import { IdeacaoImg } from './IdeacaoImg';
import { useMediaQuery } from 'react-responsive';

export const IdeacaoImagem = ({ideia}: {ideia: Ideia}) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const dispach = useDispatch();
   
    const deletar = useCallback(() => {
        dispach(removerLink(ideia.id));
    }, [removerLink, ideia.id]);

    return isMobile ? (
        <AcoesWithChildren itens={[{id: `acoes-ideia-${ideia.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />}]}>
            <IdeacaoImg url={ideia.link} />
        </AcoesWithChildren>
    ) : (
        <button
            onClick={deletar}
            className="relative group p-0 border-none bg-transparent cursor-pointer"
            style={{ outline: 'none' }}
        >
            <span className="block">
                <IdeacaoImg url={ideia.link} />
            </span>
            <span
                className="absolute inset-0 flex items-center justify-center transition duration-200 group-hover:bg-(--black)/40"
            >
                <BsTrash3 className="opacity-0 group-hover:opacity-100! text-(--white) text-3xl transition duration-200" />
            </span>
        </button>
    )
}