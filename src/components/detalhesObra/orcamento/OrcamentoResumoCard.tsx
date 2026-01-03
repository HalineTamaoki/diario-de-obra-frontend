import { useCallback } from 'react'
import { BsEye, BsPatchCheckFill, BsTrash3 } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletarOrcamento, selecionarOrcamento } from '../../../features/orcamentoSlice'
import type { OrcamentoResumo } from '../../../types/Orcamento'
import { AcoesButton } from '../../common/AcoesButton'

export const OrcamentoResumoCard = ({orcamento}: {orcamento: OrcamentoResumo}) => {
    const dispach = useDispatch();
    const navigate = useNavigate();
    
    const selecionar = useCallback(() => {
        dispach(selecionarOrcamento(orcamento.id));
    }, [selecionarOrcamento, orcamento.id]);

    const deletar = useCallback(() => {
        dispach(deletarOrcamento(orcamento.id));
    }, [deletarOrcamento, orcamento.id]);

    const verDetalhes = useCallback(() => {
        navigate(`/orcamento/${orcamento.id}`);
    }, [navigate, orcamento.id]);

    return (
        <div id={`orcamento-${orcamento.id}-wrapper`}>
            <div>
                <div>
                    <h4 id={`orcamento-${orcamento.id}-title`}>{orcamento.empresa}</h4>
                    <BsPatchCheckFill />
                </div>
                <div>
                    <p id={`orcamento-${orcamento.id}-valor`}>Valor: R${orcamento.valor.toFixed(2)}</p>
                </div>
            </div>
            <AcoesButton 
                itens={[
                    {id: `acoes-orcamento-${orcamento.id}-selecionar`, text: 'Marcar como selecionado', onClick: selecionar, icon: <BsPatchCheckFill />},
                    {id: `acoes-orcamento-${orcamento.id}-detalhes`, text: 'Ver detalhes/editar', onClick: verDetalhes, icon: <BsEye />},
                    {id: `acoes-orcamento-${orcamento.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
                ]}
            />
        </div>        
    )
}
