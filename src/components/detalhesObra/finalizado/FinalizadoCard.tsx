import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { mostrarNotificacao } from '../../../features/notificacaoSlice'
import { useEditarComentarioFinalizacaoMutation, useEditarDataFinalizacaoMutation, useMarcarFinalizadoMutation, useObterFinalizacaoQuery } from '../../../services/finalizacaoApi'
import type { IdObraIdItem } from '../../../types/DetalhesObra'
import { ButtonSpinner } from '../../common/ButtonSpinner'
import { ComentarioInput } from '../../common/ComentarioInput'
import { DatePicker } from '../../common/DatePicker'
import { LoadingContainer } from '../../common/LoadingContainer'

export const FinalizadoCard = (props: IdObraIdItem) => {
    const { idItem } = props;
    const { data: finalizacao, isLoading } = useObterFinalizacaoQuery(props);
    const [ editarComentarioFinalizacao, { isLoading: isEditarComentarioLoading } ] = useEditarComentarioFinalizacaoMutation();
    const [ editarDataFinalizacao, { isLoading: isEditarDataFinalizacaoLoading } ] = useEditarDataFinalizacaoMutation();
    const [ marcarFinalizado, { isLoading: isMarcarFinalizadoLoading } ] = useMarcarFinalizadoMutation();

    const dispatch = useDispatch();

    const alterarData = useCallback((data: string) => {
        editarDataFinalizacao({ ...props, data}).unwrap().catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar data de finalização.'})));
    }, [props]);

    const alterarComentario = useCallback((comentarios: string) => {
        editarComentarioFinalizacao({ ...props, comentarios}).unwrap().catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar comentário de finalização.'})));
    }, [props]);

    const marcarComoFinalizado = useCallback(() => {
        marcarFinalizado({...props, selecionado: !finalizacao?.data}).catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao marcar como finalizado.'})));
    }, [props, finalizacao?.data]);

    return (
        <div id={`execucao-${idItem}`} className='px-2 pt-2 grid gap-1 w-full max-w-full min-w-0 max-h-60 overflow-auto'>
            <LoadingContainer isLoading={isLoading} className='justify-center'>
                <DatePicker 
                    label='Data da conclusão'
                    value={finalizacao?.data} 
                    id='conclusao' 
                    labelClassName='font-medium'
                    inputClassName='mt-1'
                    onChange={alterarData}
                    type='date'
                    loading={isEditarDataFinalizacaoLoading}
                />
                <div>
                    <p className='mb-1 font-medium'>Comentários:</p>
                    <ComentarioInput
                        initialValue={finalizacao?.comentarios ?? ''}
                        alterarComentario={alterarComentario}
                        disabled={isEditarComentarioLoading}
                    />
                </div>
                <button 
                    onClick={marcarComoFinalizado}
                    className='bg-(--green) hover:bg-(--green-2) w-full text-center rounded shadow-[0_2px_4px_rgba(0,0,0,0.25)] mt-3'
                    disabled={isMarcarFinalizadoLoading}
                >
                    {finalizacao?.data ? 'Desmarcar finalizado' : 'Marcar como finalizado'}
                    <ButtonSpinner loading={isMarcarFinalizadoLoading}/>
                </button>
            </LoadingContainer>
        </div>
    )
}
