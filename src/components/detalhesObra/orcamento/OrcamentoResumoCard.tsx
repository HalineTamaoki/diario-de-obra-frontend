import { useCallback, useMemo } from 'react'
import { BsEye, BsPatchCheck, BsPatchCheckFill, BsTrash3 } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deletarOrcamento, desselecionarOrcamento, selecionarOrcamento } from '../../../features/orcamentoSlice'
import type { OrcamentoResumo } from '../../../types/Orcamento'
import { AcoesButton } from '../../common/AcoesButton'

export const OrcamentoResumoCard = ({orcamento, idObra}: {orcamento: OrcamentoResumo, idObra: number}) => {
    const dispach = useDispatch();
    const navigate = useNavigate();

    const bgColor = useMemo(() => orcamento.selecionado ? 'bg-(--secondary)' : '', [orcamento.selecionado]);
    
    const selecionar = useCallback(() => {
        dispach(selecionarOrcamento(orcamento.id));
    }, [selecionarOrcamento, orcamento.id]);

    const desselecionar = useCallback(() => {
        dispach(desselecionarOrcamento(orcamento.id));
    }, [selecionarOrcamento, orcamento.id]);

    const deletar = useCallback(() => {
        dispach(deletarOrcamento(orcamento.id));
    }, [deletarOrcamento, orcamento.id]);

    const verDetalhes = useCallback(() => {
        navigate(`/orcamento/${idObra}/${orcamento.id}`);
    }, [navigate, orcamento.id]);

    return (
        <div id={`orcamento-${orcamento.id}-wrapper`} className={`flex justify-between items-center border border-(--secondary) rounded p-2 ${bgColor}`}>
            <div>
                <div className='flex items-center gap-2'>
                    <h4 id={`orcamento-${orcamento.id}-title`} className='text-[1rem]! font-semibold!'>{orcamento.empresa}</h4>
                    {orcamento.selecionado && <BsPatchCheckFill className='text-sm mb-1'/>}
                </div>
                <div>
                    <p id={`orcamento-${orcamento.id}-valor`} className='text-[0.9rem] mb-0'>
                        Valor: {orcamento.valor ? `R$${orcamento.valor.toFixed(2)}` : '-'}
                    </p>
                </div>
            </div>
            <AcoesButton 
                itens={[
                    orcamento.selecionado ? 
                        {id: `acoes-orcamento-${orcamento.id}-desselecionar`, text: 'Desselecionar', onClick: desselecionar, icon: <BsPatchCheck />} :
                        {id: `acoes-orcamento-${orcamento.id}-selecionar`, text: 'Marcar como selecionado', onClick: selecionar, icon: <BsPatchCheckFill />},
                    {id: `acoes-orcamento-${orcamento.id}-detalhes`, text: 'Ver detalhes/editar', onClick: verDetalhes, icon: <BsEye />},
                    {id: `acoes-orcamento-${orcamento.id}-deletar`, text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
                ]}
            />
        </div>        
    )
}
