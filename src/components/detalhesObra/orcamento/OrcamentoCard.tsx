import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/store';
import { Link } from 'react-router-dom';
import { OrcamentoResumoCard } from './OrcamentoResumoCard';

export const OrcamentoCard = ({id}: {id: number}) => {
    const { resumoOrcamentos } = useSelector((state: RootState) => state.orcamento);

    const valorMedio = useMemo(() => {
        if (!resumoOrcamentos || resumoOrcamentos.length === 0) return 0;

        const total = resumoOrcamentos.reduce((sum, item) => sum + (item.valor ?? 0), 0);
        return total / resumoOrcamentos.length;
    }, [resumoOrcamentos]);

    return (
        <div className='px-2 pt-2 overflow-auto max-h-60'>
            {valorMedio > 0 &&<p id={`orcamento-card-media-${id}`} className='mb-1'>Média: R${valorMedio.toFixed(2)}</p>}
            <Link to={`/orcamento/${id}/novo`} id={`orcamento-card-novo-${id}`} className='text-(--blue)! text-sm w-full block underline! hover:text-(--blue-2)! mb-3'>
                Adicionar novo
            </Link>
            {resumoOrcamentos && resumoOrcamentos.length > 0 ? (
              <div className='grid gap-2'>
                {resumoOrcamentos.map((orcamento) => 
                  <OrcamentoResumoCard orcamento={orcamento} key={orcamento.id} idObra={id}/>)}
              </div>  
            ) : (
                <p className="text-gray-500 text-start text-sm mb-0">Nenhum orçamento adicionado.</p>
            )}
        </div>
    )
}
