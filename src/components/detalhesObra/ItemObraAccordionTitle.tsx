import { useCallback, useMemo } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { itemsObraActions } from '../../features/itemsObraSlice';
import type { EtapasObra } from '../../types/DetalhesObra';

export const ItemObraAccordionTitle = ({ultimaEtapa, id}: {ultimaEtapa: EtapasObra, id: number}) => {
    const dispach = useDispatch();
    
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
        dispach(itemsObraActions.avancarEtapa(id))
    }, [itemsObraActions.avancarEtapa, id]);

    const voltar = useCallback(() => {
        dispach(itemsObraActions.voltarEtapa(id))
    }, [itemsObraActions.voltarEtapa, id]);

    return (
        <div className='flex justify-between align-items-center' id={`${id}-accordion-title`}>
            {ultimaEtapa === 'ideacao' ? <span></span> : <button id={`${id}-accordion-title-btn-before`} className='p-0' onClick={voltar}>
                <BsChevronLeft />
            </button>}
            <h4 id={`${id}-accordion-title-titulo`} className='text-[1rem]! font-semibold!'>{title}</h4>
            {ultimaEtapa === 'finalizado' ? <span></span> : <button id={`${id}-accordion-title-btn-next`} className='p-0' onClick={avancar}>
                <BsChevronRight />
            </button>}
        </div>
    )
}

