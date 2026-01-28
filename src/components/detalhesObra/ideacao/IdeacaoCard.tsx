import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { itemsObraActions, selectItemObra } from '../../../features/itemsObraSlice';
import { AddInput } from '../../common/AddInput';
import { IdeacaoImagem } from './IdeacaoImagem';

export const IdeacaoCard = ({id}: {id: number}) => {
    const dispach = useDispatch();
    const detalhesObra = useSelector((state: RootState) => state.detalhesObra);
    const itemObra = selectItemObra(detalhesObra, id);
    const ideias = useMemo(() => itemObra?.ideacao ?? [], [itemObra]);
 
    const addIdeia = useCallback((value: string) => {
        dispach(itemsObraActions.addLink({link: value, idItem: id}));
    }, [itemsObraActions.addLink]);

    return (
        <div className='w-full' id={`ideacao-card-${id}`}>
            <AddInput 
                placeholder='Insira o link com a ideia'
                add={addIdeia}
                id={`ideacao-input-${id}`}
            />
            {!ideias || ideias?.length === 0 ? (
                <p className="text-gray-500 text-start text-sm mb-0 ml-2">Nenhum link adicionado.</p>
            ) : (
                <div className="w-full flex overflow-x-auto whitespace-nowrap max-w-full md:gap-2" id={`ideacao-carrossel-${id}`}>
                    {ideias?.map(ideia => (
                        <IdeacaoImagem key={ideia.id} ideia={ideia} />
                    ))}
                </div>
            )}
        </div>
    )
}
