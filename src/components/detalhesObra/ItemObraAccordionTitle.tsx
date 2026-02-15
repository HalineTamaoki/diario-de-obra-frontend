import { useCallback, useMemo } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useEtapasItem } from '../../hooks/useEtapasItem';
import type { EtapasObra, IdObraIdItem } from '../../types/DetalhesObra';

export const ItemObraAccordionTitle = ({ultimaEtapa, idObra, idItem}: {ultimaEtapa: EtapasObra} & IdObraIdItem) => {
    const { avancarEtapa, voltarEtapa } = useEtapasItem(idObra);
    
    const title = useMemo(() => {
        switch(ultimaEtapa){
            case 'ideacao':
                return 'Ideias para a obra'
            case 'orcamento':
                return 'Orçamentos'
            case 'execucao':
                return 'Execução'
            case 'finalizado':
                return 'Finalizado'
        }
    }, [ultimaEtapa]);

    const avancar = useCallback(() => {
        avancarEtapa(idItem);
    }, [avancarEtapa, idItem]);

    const voltar = useCallback(() => {
        voltarEtapa(idItem);
    }, [voltarEtapa, idItem]);

    return (
        <div className='flex justify-between align-items-center' id={`${idItem}-accordion-title`}>
            {ultimaEtapa === 'ideacao' ? <span></span> : <button id={`${idItem}-accordion-title-btn-before`} className='p-0' onClick={voltar}>
                <BsChevronLeft />
            </button>}
            <h4 id={`${idItem}-accordion-title-titulo`} className='text-[1rem]! font-semibold!'>{title}</h4>
            {ultimaEtapa === 'finalizado' ? <span></span> : <button id={`${idItem}-accordion-title-btn-next`} className='p-0' onClick={avancar}>
                <BsChevronRight />
            </button>}
        </div>
    )
}

