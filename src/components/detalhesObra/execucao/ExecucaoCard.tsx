import { useCallback, useMemo } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../../app/store';
import { itemsObraActions, selectItemObra } from '../../../features/itemsObraSlice';
import type { Previsao } from '../../../types/Execucao';
import { AcoesButton } from '../../common/AcoesButton';
import { ComentarioInput } from '../../common/ComentarioInput';
import { DatePicker } from '../../common/DatePicker';
import { diffDays } from '../../common/utils';


export const ExecucaoCard = ({id}: {id: number}) => {
    const detalhesObra = useSelector((state: RootState) => state.detalhesObra);
    const itemObra = selectItemObra(detalhesObra, id);
    const execucao = useMemo(() => itemObra?.execucao, [itemObra]);

    const dispatch = useDispatch();

    const duracao = useMemo(() => diffDays(execucao?.previsao?.inicio, execucao?.previsao?.termino), [execucao?.previsao]);
    
    const alterarPrevisao = useCallback((key: keyof Previsao, novoValor: string) => {
        dispatch(itemsObraActions.editarPrevisao({
            ...execucao?.previsao,
            [key]: novoValor,
            idItem: id,
        }))
    }, [execucao?.previsao, itemsObraActions.editarPrevisao]); 

    const alterarOutraData = useCallback((idOutraData: number, novoValor: string) => {
        dispatch(itemsObraActions.editarOutraData({
            id: idOutraData,
            data: novoValor,
            idItem: id,
        }));
    }, [itemsObraActions.editarOutraData]);

    const deletarOutraData = useCallback((idOutraData: number) => {
        dispatch(itemsObraActions.removerOutraData({id: idOutraData, idItem: id}));
    }, [itemsObraActions.removerOutraData]);

    const marcarComoFinalizado = useCallback(() => {
        dispatch(itemsObraActions.marcarFinalizado(id));
        dispatch(itemsObraActions.editarDataFinalizacao({
            data: new Date().toISOString().split('T')[0],
            idItem: id,
        }));
        dispatch(itemsObraActions.avancarEtapa(id));
    }, [itemsObraActions.editarDataFinalizacao, itemsObraActions.marcarFinalizado]);

    const alterarComentario = useCallback((value: string) => {
        if(value !== execucao?.comentarios){
            dispatch(itemsObraActions.editarComentarioExecucao({comentario: value, idItem: id}));
        }
    }, [itemsObraActions.editarComentarioExecucao, itemsObraActions.avancarEtapa]);

    return (
        <div id={`execucao-${id}`} className='px-2 pt-2 grid gap-1 w-full max-w-full min-w-0 max-h-60 overflow-auto'>
            <DatePicker 
                label='Início'
                value={execucao?.previsao?.inicio} 
                id='previsao-inicio' 
                labelClassName='font-medium'
                inputClassName='mt-1'
                onChange={novoValor => alterarPrevisao('inicio', novoValor)}
            />
            <DatePicker 
                label='Término'
                value={execucao?.previsao?.termino} 
                id='previsao-termino' 
                labelClassName='font-medium'
                inputClassName='mt-1'
                onChange={novoValor => alterarPrevisao('termino', novoValor)}
            />

            {duracao && <p><span className='font-medium'>Duração:</span> {duracao} dias</p>}
            <div>
                <p className='mb-1 font-medium'>Comentários:</p>
                <ComentarioInput
                    initialValue={execucao?.comentarios ?? ''}
                    alterarComentario={alterarComentario}
                />
            </div>
            {
                execucao?.outrasDatas && execucao.outrasDatas.length > 0 && (
                    <div className='max-w-full min-w-0' id='outras-datas-wrapper'>
                        <p className='font-medium mb-1'>Outras datas:</p>
                        <div className='grid gap-2'>
                            {execucao?.outrasDatas?.map(data => (
                                <div key={data.id} className='flex max-w-full min-w-0 items-center gap-2'>
                                    <DatePicker 
                                        label={data.nome} 
                                        value={data.data} 
                                        id={data.id.toString()}
                                        className='w-full'
                                        onChange={novoValor => alterarOutraData(data.id, novoValor)}
                                    />
                                    <AcoesButton
                                        btnClassName='p-0'
                                        itens={[
                                            {id: 'acoes-data-deletar', text: 'Deletar', onClick: () => deletarOutraData(data.id), className: 'text-(--red)', icon: <BsTrash3 />},
                                        ]}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            <Link 
                to={`/obra/${id}/nova-data/${itemObra?.id}`} 
                id={`execucao-nova-data-${id}`} 
                className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-1 mt-2 text-end'
            >
                Adicionar outra data
            </Link>
            {!execucao?.finalizado && <button 
                onClick={marcarComoFinalizado}
                className='bg-(--blue) hover:bg-(--blue-2) w-full text-center text-white rounded shadow-[0_2px_4px_rgba(0,0,0,0.25)] mt-3'
            >
                Marcar como finalizado
            </button>}
        </div>
    )
}
