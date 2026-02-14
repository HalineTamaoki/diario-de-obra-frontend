import { useCallback } from 'react';
import { mostrarNotificacao } from '../../../features/notificacaoSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAddLinkMutation, useObterIdeiasByItemQuery } from '../../../services/ideacaoApi';
import type { IdObraIdItem } from '../../../types/DetalhesObra';
import { AddInput } from '../../common/AddInput';
import { LoadingContainer } from '../../common/LoadingContainer';
import { IdeacaoImagem } from './IdeacaoImagem';
    
export const IdeacaoCard = (props: IdObraIdItem) => {
    const {idItem, idObra} = props;
    const { data: ideias, isLoading } = useObterIdeiasByItemQuery(props);
    const dispatch = useAppDispatch();
    const [ addLink, { isLoading: isAddIdeiaLoading }] = useAddLinkMutation();
 
    const addIdeia = useCallback((value: string) => {
        addLink({ idObra: idObra, itemidObra: idItem, link: value }).unwrap().catch(error => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao adicionar ideia.'}));
        });
    }, [addLink, idObra, idItem]);

    return (
        <div className='w-full' id={`ideacao-card-${idItem}`}>
            <LoadingContainer isLoading={isLoading} className='justify-center'>
                <AddInput 
                    placeholder='Insira o link com a ideia'
                    add={addIdeia}
                    id={`ideacao-input-${idItem}`}
                    loading={isAddIdeiaLoading}
                />
                {!ideias || ideias?.length === 0 ? (
                    <p className="text-gray-500 text-start text-sm mb-0 ml-2">Nenhum link adicionado.</p>
                ) : (
                    <div className="w-full flex overflow-x-auto whitespace-nowrap max-w-full md:gap-2" id={`ideacao-carrossel-${idItem}`}>
                        {ideias?.map(ideia => (
                            <IdeacaoImagem key={ideia.id} ideia={ideia} idObra={idObra}/>
                        ))}
                    </div>
                )}
            </LoadingContainer>
        </div>
    )
}
