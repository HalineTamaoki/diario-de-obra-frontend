import { useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { mostrarNotificacao } from '../../../features/notificacaoSlice';
import { AddInput } from '../../common/AddInput';
import { IdeacaoImagem } from './IdeacaoImagem';
import { useObterIdeiasByItemQuery, useAddLinkMutation } from '../../../services/ideacaoApi';

export const IdeacaoCard = ({id, idObra}: {id: number, idObra: number}) => {
    const { data: ideias, isLoading } = useObterIdeiasByItemQuery({ obraId: idObra, idItem: id });
    const dispatch = useDispatch();
    const [ addLink, { isLoading: isAddIdeiaLoading }] = useAddLinkMutation();
 
    const addIdeia = useCallback((value: string) => {
        addLink({ obraId: idObra, itemObraId: id, link: value }).unwrap().catch(error => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao adicionar ideia. Tente novamente.'}));
        });
    }, [addLink, idObra, id]);

    return (
        <div className='w-full' id={`ideacao-card-${id}`}>
            {isLoading ? <Spinner /> : (
                <>
                    <AddInput 
                        placeholder='Insira o link com a ideia'
                        add={addIdeia}
                        id={`ideacao-input-${id}`}
                        loading={isAddIdeiaLoading}
                    />
                    {!ideias || ideias?.length === 0 ? (
                        <p className="text-gray-500 text-start text-sm mb-0 ml-2">Nenhum link adicionado.</p>
                    ) : (
                        <div className="w-full flex overflow-x-auto whitespace-nowrap max-w-full md:gap-2" id={`ideacao-carrossel-${id}`}>
                            {ideias?.map(ideia => (
                                <IdeacaoImagem key={ideia.id} ideia={ideia} obraId={idObra}/>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
