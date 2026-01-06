import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLink } from '../../../features/ideacaoSlice';
import { AddInput } from '../../common/AddInput';
import { IdeacaoImagem } from './IdeacaoImagem';
import type { RootState } from '../../../app/store';

export const IdeacaoCard = ({id}: {id: number}) => {
    const dispach = useDispatch();
    const { ideias } = useSelector((state: RootState) => state.ideacao);
 
    const addIdeia = useCallback((value: string) => {
        dispach(addLink({link: value}));
    }, [addLink]);

    return (
        <div className='w-full' id={`ideacao-card-${id}`}>
            <AddInput 
                placeholder='Insira o link com a ideia'
                add={addIdeia}
                id={`ideacao-input-${id}`}
            />
            {ideias.length === 0 ? (
                <p className="text-gray-500 text-start text-sm mb-0 ml-2">Nenhum link adicionado.</p>
            ) : (
                <div className="w-full flex overflow-x-auto whitespace-nowrap max-w-full" id={`ideacao-carrossel-${id}`}>
                    {ideias.map(ideia => (
                        <IdeacaoImagem key={ideia.id} ideia={ideia} />
                    ))}
                </div>
            )}
        </div>
    )
}
