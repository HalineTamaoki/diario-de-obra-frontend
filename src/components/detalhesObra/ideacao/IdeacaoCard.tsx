import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addLink } from '../../../features/ideacaoSlice';
import { AddInput } from '../../common/AddInput';

export const IdeacaoCard = ({id}: {id: number}) => {
    const dispach = useDispatch();

    const addIdeia = useCallback((value: string) => {
        dispach(addLink({link: value}));
    }, [addLink]);

    return (
        <div className='w-full'>
            <AddInput 
                placeholder='Insira o link com a ideia'
                add={addIdeia}
                id={`ideacao-input-${id}`}
            />
        </div>
    )
}
