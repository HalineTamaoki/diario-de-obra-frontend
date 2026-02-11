import { useCallback, useMemo } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { mostrarNotificacao } from '../../../features/notificacaoSlice';
import { useEtapasItem } from '../../../hooks/useEtapasItem';
import { useEditarComentarioExecucaoMutation, useEditarOutraDataMutation, useEditarPrevisaoMutation, useObterExecucaoQuery, useRemoverOutraDataMutation } from '../../../services/execucaoApi';
import { useMarcarFinalizadoMutation } from '../../../services/finalizacaoApi';
import type { IdObraIdItem } from '../../../types/DetalhesObra';
import type { OutraData, Previsao } from '../../../types/Execucao';
import { AcoesButton } from '../../common/AcoesButton';
import { ButtonSpinner } from '../../common/ButtonSpinner';
import { ComentarioInput } from '../../common/ComentarioInput';
import { DatePicker } from '../../common/DatePicker';
import { LoadingContainer } from '../../common/LoadingContainer';
import { diffDays } from '../../common/utils';

export const ExecucaoCard = (props: IdObraIdItem) => {
    const {idItem, idObra} = props;
    const { data: execucao, isLoading } = useObterExecucaoQuery({idItem, idObra});
    const [ editarPrevisao, { isLoading: isEditarPrevisaoLoading } ] = useEditarPrevisaoMutation();
    const [ editarComentarioExecucao, { isLoading: isEditarComentarioLoading } ] = useEditarComentarioExecucaoMutation();
    const [ removerOutraData, { isLoading: isRemoverOutraDataLoading } ] = useRemoverOutraDataMutation();
    const [ editarOutraData, { isLoading: isEditarOutraDataLoading } ] = useEditarOutraDataMutation();
    const [ marcarFinalizado, { isLoading: isMarcarFinalizadoLoading } ] = useMarcarFinalizadoMutation();
    const { avancarEtapa } = useEtapasItem(idObra);

    const isEditarLoading = useMemo(() => 
        isEditarPrevisaoLoading || isEditarComentarioLoading || isEditarOutraDataLoading || isMarcarFinalizadoLoading
    , [isEditarComentarioLoading, isEditarPrevisaoLoading, isEditarOutraDataLoading, isMarcarFinalizadoLoading]);

    const dispatch = useDispatch();

    const duracao = useMemo(() => diffDays(execucao?.previsao?.inicio, execucao?.previsao?.termino), [execucao?.previsao]);
    
    const alterarPrevisao = useCallback((key: keyof Previsao, novoValor: string) => {
        editarPrevisao({
            ...props,
            ...execucao?.previsao,
            [key]: novoValor,
        }).unwrap().catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar previsão.'})));
    }, [execucao?.previsao, editarPrevisao, props]); 

    const alterarOutraData = useCallback((data: OutraData) => {
        editarOutraData({
            ...props,
            ...data
        }).unwrap().catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar outra data.'})));
    }, [props]);

    const deletarOutraData = useCallback((idOutraData: number) => {
        removerOutraData({...props, id: idOutraData}).unwrap().catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao remover outra data.'})));
    }, [props, removerOutraData]);

    const marcarComoFinalizado = useCallback(() => {
        marcarFinalizado({...props, selecionado: true}).unwrap().then(() => {
            avancarEtapa(idItem);
        }).catch(error => 
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao marcar como finalizado.'})));
    }, [props]);

    const alterarComentario = useCallback((value: string) => {
        if(value !== execucao?.comentarios){
            editarComentarioExecucao({...props, comentario: value}).unwrap().catch(error => 
                dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar comentário.'})));
        }
    }, [execucao?.comentarios, editarComentarioExecucao, props]);

    return (
        <div id={`execucao-${idItem}`} className='px-2 pt-2 grid gap-1 w-full max-w-full min-w-0 max-h-60 overflow-auto'>
            <LoadingContainer isLoading={isLoading} className='justify-center'>
                <DatePicker 
                    label='Início'
                    value={execucao?.previsao?.inicio} 
                    id='previsao-inicio' 
                    labelClassName='font-medium'
                    inputClassName='mt-1'
                    onChange={novoValor => alterarPrevisao('inicio', novoValor)}
                    loading={isEditarLoading}
                />
                <DatePicker 
                    label='Término'
                    value={execucao?.previsao?.termino} 
                    id='previsao-termino' 
                    labelClassName='font-medium'
                    inputClassName='mt-1'
                    onChange={novoValor => alterarPrevisao('termino', novoValor)}
                    loading={isEditarLoading}
                />

                {duracao && <p><span className='font-medium'>Duração:</span> {duracao} dias</p>}
                <div>
                    <p className='mb-1 font-medium'>Comentários:</p>
                    <ComentarioInput
                        initialValue={execucao?.comentarios ?? ''}
                        alterarComentario={alterarComentario}
                        disabled={isEditarLoading}
                    />
                </div>
                {
                    execucao?.datasAdicionais && execucao.datasAdicionais.length > 0 && (
                        <div className='max-w-full min-w-0' id='outras-datas-wrapper'>
                            <p className='font-medium mb-1'>Outras datas:</p>
                            <div className='grid gap-2'>
                                {execucao?.datasAdicionais?.map(data => (
                                    <div key={data.id} className='flex max-w-full min-w-0 items-center gap-2'>
                                        <DatePicker 
                                            label={data.nome} 
                                            value={data.data} 
                                            id={data.id.toString()}
                                            className='w-full'
                                            onChange={novoValor => alterarOutraData({...data, data: novoValor})}
                                            loading={isEditarLoading}
                                        />
                                        <AcoesButton
                                            btnClassName='p-0'
                                            itens={[
                                                {id: 'acoes-data-deletar', text: 'Deletar', onClick: () => deletarOutraData(data.id), className: 'text-(--red)', icon: <BsTrash3 />},
                                            ]}
                                            loading={isRemoverOutraDataLoading}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
                <Link 
                    to={`/obra/${idObra}/nova-data/${idItem}`} 
                    id={`execucao-nova-data-${idItem}`} 
                    className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-1 mt-2 text-end'
                >
                    Adicionar outra data
                </Link>
                {!execucao?.finalizado && <button 
                    onClick={marcarComoFinalizado}
                    className='bg-(--blue) hover:bg-(--blue-2) w-full text-center text-white rounded shadow-[0_2px_4px_rgba(0,0,0,0.25)] mt-3'
                    disabled={isMarcarFinalizadoLoading}
                >
                    Marcar como finalizado
                    <ButtonSpinner loading={isMarcarFinalizadoLoading}/>
                </button>}
            </LoadingContainer>
        </div>
    )
}
