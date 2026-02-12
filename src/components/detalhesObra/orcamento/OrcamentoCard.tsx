import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useObterTodosOrcamentosQuery } from '../../../services/orcamentoApi';
import type { IdObraIdItem } from '../../../types/DetalhesObra';
import { LoadingContainer } from '../../common/LoadingContainer';
import { OrcamentoResumoCard } from './OrcamentoResumoCard';

export const OrcamentoCard = (props: IdObraIdItem) => {
    const { idItem, idObra } = props;
    const { data: orcamentos, isLoading } = useObterTodosOrcamentosQuery(props);

    const valorMedio = useMemo(() => {
        if (!orcamentos || orcamentos.length === 0) return 0;

        const total = orcamentos.reduce((sum, item) => sum + (item.valor ?? 0), 0);
        return total / orcamentos.length;
    }, [orcamentos]);

    return (
        <div className='px-2 pt-2 overflow-auto max-h-60'>
            <LoadingContainer isLoading={isLoading} className='justify-center'>
                {valorMedio > 0 &&<p id={`orcamento-card-media-${idItem}`} className='mb-1'>Média: R${valorMedio.toFixed(2)}</p>}
                <Link to={`/obra/${idObra}/orcamento/${idItem}/novo`} id={`orcamento-card-novo-${idItem}`} className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-3'>
                    Adicionar novo
                </Link>
                {orcamentos && orcamentos.length > 0 ? (
                <div className='grid gap-2'>
                    {orcamentos.map((orcamento) => 
                    <OrcamentoResumoCard orcamento={orcamento} key={orcamento.id} idItem={idItem} idObra={idObra}/>)}
                </div>  
                ) : (
                    <p className="text-gray-500 text-start text-sm mb-0">Nenhum orçamento adicionado.</p>
                )}
            </LoadingContainer>
        </div>
    )
}
