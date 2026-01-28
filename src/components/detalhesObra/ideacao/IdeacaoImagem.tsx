import { useCallback } from 'react';
import { BsEye, BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { itemsObraActions } from '../../../features/itemsObraSlice';
import type { Ideia } from '../../../types/Ideia';
import { AcoesWithChildren } from '../../common/AcoesWithChildren';
import { IdeacaoImg } from './IdeacaoImg';

export const IdeacaoImagem = ({ideia}: {ideia: Ideia}) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const dispach = useDispatch();
   
    const deletar = useCallback(() => {
        dispach(itemsObraActions.removerLink({id: ideia.id, idItem: ideia.idItem}));
    }, [itemsObraActions.removerLink, ideia.id]);

    const verImagem = useCallback(() => {
        window.open(ideia.link, '_blank');
    }, []);

    return isMobile ? (
        <AcoesWithChildren itens={[
            {id: `acoes-ideia-${ideia.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
            {id: `acoes-ideia-${ideia.id}-abrir`, text: 'Abrir', onClick: verImagem, icon: <BsEye />}
        ]}>
            <IdeacaoImg url={ideia.link} />
        </AcoesWithChildren>
    ) : (
        <div className='grid'>
            <button
                onClick={verImagem}
                className="relative group p-0 border-none bg-transparent cursor-pointer"
                style={{ outline: 'none' }}
            >
                <span className="block">
                    <IdeacaoImg url={ideia.link} />
                </span>
                <span
                    className="absolute inset-0 flex items-center justify-center transition duration-200 group-hover:bg-(--black)/40"
                >
                    <BsEye className="opacity-0 group-hover:opacity-100! text-(--white) text-3xl transition duration-200" />
                </span>
            </button>
            <button onClick={deletar} className='text-sm! text-(--red) p-0 mt-1'>Deletar</button>
        </div>
    )
}