import { useCallback, useMemo } from 'react'
import { BsEye, BsPatchCheck, BsPatchCheckFill, BsTrash3 } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { mostrarNotificacao } from '../../../features/notificacaoSlice'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useDeletarOrcamentoMutation, useSelecionarOrcamentoMutation } from '../../../services/orcamentoApi'
import type { IdObraIdItem } from '../../../types/DetalhesObra'
import type { OrcamentoResumo } from '../../../types/Orcamento'
import { converterMoeda } from '../../../utils/NumberUtils'
import { AcoesButton } from '../../common/AcoesButton'

export const OrcamentoResumoCard = ({orcamento, idItem, idObra}: {orcamento: OrcamentoResumo} & IdObraIdItem) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [ selecionarOrcamento, { isLoading: isSelecionarOrcamentoLoading }] = useSelecionarOrcamentoMutation();
    const [ deletarOrcamento, { isLoading: isDeletarOrcamentoLoading }] = useDeletarOrcamentoMutation();

    const bgColor = useMemo(() => orcamento.selecionado ? 'bg-(--secondary)' : '', [orcamento.selecionado]);
    
    const selecionar = useCallback(() => {
        selecionarOrcamento({id: orcamento.id, idItem, idObra, selecionado: !orcamento.selecionado}).unwrap().catch(error => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao selecionar orçamento.'}));
        });
    }, [orcamento.id, idItem, idObra, orcamento.selecionado, selecionarOrcamento, dispatch]);

    const deletar = useCallback(() => {
        deletarOrcamento({id: orcamento.id, idItem, idObra}).unwrap().catch(error => {
            dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao selecionar orçamento.'}));
        });
    }, [orcamento.id, idItem, idObra]);

    const verDetalhes = useCallback(() => {
        navigate(`/obra/${idObra}/orcamento/${idItem}/${orcamento.id}`);
    }, [navigate, orcamento.id, idObra]);

    return (
        <div id={`orcamento-${orcamento.id}-wrapper`} className={`flex justify-between items-center border-1 border-(--secondary) rounded p-2 ${bgColor}`}>
            <div>
                <div className='flex items-center gap-2'>
                    <h4 id={`orcamento-${orcamento.id}-title`} className='text-[1rem]! font-semibold!'>{orcamento.empresa}</h4>
                    {orcamento.selecionado && <BsPatchCheckFill className='text-sm mb-1'/>}
                </div>
                <div>
                    <p id={`orcamento-${orcamento.id}-valor`} className='text-[0.9rem] mb-0'>
                        Valor: {orcamento.valor ? converterMoeda(orcamento.valor) : '-'}
                    </p>
                </div>
            </div>
            <AcoesButton 
                itens={[
                    orcamento.selecionado ? 
                        {id: `acoes-orcamento-${orcamento.id}-desselecionar`, text: 'Desselecionar', onClick: selecionar, icon: <BsPatchCheck />} :
                        {id: `acoes-orcamento-${orcamento.id}-selecionar`, text: 'Marcar como selecionado', onClick: selecionar, icon: <BsPatchCheckFill />},
                    {id: `acoes-orcamento-${orcamento.id}-detalhes`, text: 'Ver detalhes/editar', onClick: verDetalhes, icon: <BsEye />},
                    {id: `acoes-orcamento-${orcamento.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
                ]}
                loading={isSelecionarOrcamentoLoading || isDeletarOrcamentoLoading}
            />
        </div>        
    )
}
