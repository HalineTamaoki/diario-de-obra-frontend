import { useCallback, useMemo } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { editarOutraData, editarPrevisao, removerOutraData } from '../../../features/execucaoSlice';
import { AcoesButton } from '../../common/AcoesButton';
import { DatePicker } from '../../common/DatePicker';
import { diffDays } from '../../common/utils';
import type { Previsao } from '../../../types/Execucao';
import { Link } from 'react-router-dom';
import { ComentarioInput } from './ComentarioInput';


export const ExecucaoCard = ({id}: {id: number}) => {
    const { execucao }  = useSelector((state: RootState) => state.execucao);
    const dispatch = useDispatch();

    const duracao = useMemo(() => diffDays(execucao?.previsao?.inicio, execucao?.previsao?.termino), [execucao?.previsao]);
    
    const alterarPrevisao = useCallback((key: keyof Previsao, novoValor: string) => {
        dispatch(editarPrevisao({
            ...execucao?.previsao,
            [key]: novoValor
        }))
    }, [execucao?.previsao, editarPrevisao]); 

    const alterarOutraData = useCallback((idOutraData: number, novoValor: string) => {
        dispatch(editarOutraData({
            id: idOutraData,
            data: novoValor
        }));
    }, [editarOutraData]);

    const deletarOutraData = useCallback((idOutraData: number) => {
        dispatch(removerOutraData(idOutraData));
    }, [removerOutraData]);

    return (
        <div id={`execucao-${id}`} className='px-2 pt-2 flex flex-col w-full max-w-full min-w-0 max-h-60 overflow-auto'>
            <div className='grid gap-1 max-w-full min-w-0'>
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
                    to={`/nova-data/${id}`} 
                    id={`execucao-nova-data-${id}`} 
                    className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-1 mt-2 text-end'
                >
                    Adicionar outra data
                </Link>
            </div>
        </div>
    )
}
