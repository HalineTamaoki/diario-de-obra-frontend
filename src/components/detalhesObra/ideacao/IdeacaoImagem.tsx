import { useCallback } from 'react';
import { BsEye, BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { mostrarNotificacao } from '../../../features/notificacaoSlice';
import type { Ideia } from '../../../types/Ideia';
import { AcoesWithChildren } from '../../common/AcoesWithChildren';
import { IdeacaoImg } from './IdeacaoImg';
import { useRemoverLinkMutation } from '../../../services/ideacaoApi';

interface IdeacaoImagemProps {
    ideia: Ideia,
    idObra: number
}

export const IdeacaoImagem = ({ideia, idObra}: IdeacaoImagemProps) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [ removerLink, { isLoading }] = useRemoverLinkMutation();

    const dispatch = useDispatch();
   
    const deletar = useCallback(() => {
        removerLink({id: ideia.id, idItem: ideia.itemidObra, idObra}).unwrap().catch((error) => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao deletar item.'}));
        });
    }, [ideia, idObra]);

    const verImagem = useCallback(() => {
        window.open(ideia.link, '_blank');
    }, []);

    return isMobile ? (
        <AcoesWithChildren itens={[
            {id: `acoes-ideia-${ideia.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
            {id: `acoes-ideia-${ideia.id}-abrir`, text: 'Abrir', onClick: verImagem, icon: <BsEye />}
        ]} disabled={isLoading}>
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
            <button onClick={deletar} className='text-sm! text-(--red) p-0 mt-1' disabled={isLoading}>Deletar</button>
        </div>
    )
}