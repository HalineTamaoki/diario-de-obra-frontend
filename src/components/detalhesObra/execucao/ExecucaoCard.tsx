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


export const ExecucaoCard = ({id}: {id: number}) => {
    const { execucao }  = useSelector((state: RootState) => state.execucao);
    const dispatch = useDispatch();

    const duracao = useMemo(() => diffDays(execucao?.previsao?.termino, execucao?.previsao?.inicio), [execucao?.previsao]);
    
    const alterarPrevisao = useCallback((key: keyof Previsao, novoValor: string) => {
        dispatch(editarPrevisao({
            ...execucao?.previsao,
            [key]: novoValor
        }))
    }, [execucao?.previsao]); 

    const alterarOutraData = useCallback((idOutraData: number, novoValor: string) => {
        dispatch(editarOutraData({
            id: idOutraData,
            data: novoValor
        }));
    }, []);

    const deletarOutraData = useCallback((idOutraData: number) => {
        dispatch(removerOutraData(idOutraData));
    }, []);

    return (
        <div id={`execucao-${id}`} className='px-2 pt-2 flex flex-col w-full max-w-full min-w-0'>
            <div className='grid gap-1 max-w-full min-w-0'>
                <DatePicker 
                    label='Início'
                    value={execucao?.previsao?.inicio} 
                    id='previsao-inicio' 
                    onChange={novoValor => alterarPrevisao('inicio', novoValor)}
                />
                <DatePicker 
                    label='Término'
                    value={execucao?.previsao?.termino} 
                    id='previsao-termino' 
                    onChange={novoValor => alterarPrevisao('termino', novoValor)}
                />
                {duracao && <p><span className='font-medium'>Duração:</span> {duracao} dias</p>}
                {
                    execucao?.outrasDatas && (
                        <>
                            <p>Outras datas:</p>
                            {execucao?.outrasDatas?.map(data => (
                                <div>
                                    <DatePicker 
                                        label={data.nome} 
                                        value={data.data} 
                                        id={data.id.toString()}
                                        onChange={novoValor => alterarOutraData(data.id, novoValor)}
                                    />
                                    <AcoesButton 
                                        itens={[
                                            {id: 'acoes-data-deletar', text: 'Deletar', onClick: () => deletarOutraData(data.id), className: 'text-(--red)', icon: <BsTrash3 />},
                                        ]}
                                    />
                                </div>
                            ))}
                        </>
                    )
                }
            </div>
            <Link to={`/orcamento/${id}/novo`} id={`orcamento-card-novo-${id}`} className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-1 text-end'>
                Adicionar outra data
            </Link>
        </div>
    )
}
