import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { editarComentario, editarData } from '../../../features/finalizacaoSlice'
import { ComentarioInput } from '../../common/ComentarioInput'
import { DatePicker } from '../../common/DatePicker'

export const FinalizadoCard = ({id}: {id: number}) => {
    const { finalizacao }  = useSelector((state: RootState) => state.finalizacao);
    const dispatch = useDispatch();

    const alterarData = useCallback((novaData?: string) => {
        dispatch(editarData(novaData));
    }, [editarData]);

    const alterarComentario = useCallback((novoComentario: string) => {
        dispatch(editarComentario(novoComentario));
    }, [editarData]);

    return (
        <div id={`execucao-${id}`} className='px-2 pt-2 grid gap-1 w-full max-w-full min-w-0 max-h-60 overflow-auto'>
            <DatePicker 
                label='Data da conclusão'
                value={finalizacao?.data} 
                id='conclusao' 
                labelClassName='font-medium'
                inputClassName='mt-1'
                onChange={alterarData}
                type='date'
            />
            <div>
                <p className='mb-1 font-medium'>Comentários:</p>
                <ComentarioInput
                    initialValue={finalizacao?.comentarios ?? ''}
                    alterarComentario={alterarComentario}
                />
            </div>
            <button 
                onClick={() => alterarData(finalizacao?.data ? undefined : new Date().toISOString().split('T')[0])}
                className='bg-(--green) hover:bg-(--green-2) w-full text-center rounded shadow-[0_2px_4px_rgba(0,0,0,0.25)] mt-3'
            >
                {finalizacao?.data ? 'Desmarcar finalizado' : 'Marcar como finalizado'}
            </button>
        </div>
    )
}
