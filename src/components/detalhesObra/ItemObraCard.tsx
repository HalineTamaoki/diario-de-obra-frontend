import { Accordion } from 'react-bootstrap'
import type { ItemObra } from '../../types/DetalhesObra'
import { ItemObraAccordionHeader } from './ItemObraAccordionHeader'
import { useCallback, useState } from 'react'
import { ItemObraAccordionTitle } from './ItemObraAccordionTitle'
import { IdeacaoCard } from './ideacao/IdeacaoCard'
import { OrcamentoCard } from './orcamento/OrcamentoCard'
import { ExecucaoCard } from './execucao/ExecucaoCard'
import { FinalizadoCard } from './finalizado/FinalizadoCard'

interface ItemObraCardProps {
    itemObra: ItemObra,
    index: number
}

const getBgColor = (ultimaEtapa: string) => {
    let color = 'var(--green)' ;
    let textColor = 'var(--black)'; 

    if (ultimaEtapa === 'ideacao'){
        color = 'var(--main)'
    } else if (ultimaEtapa === 'orcamento'){
        color = 'var(--secondary)'
    } else if (ultimaEtapa === 'execucao'){
        color = 'var(--blue)'
        textColor = 'var(--white)'
    }

  return {
    ['--bs-accordion-btn-bg' as any]: color,
    ['--bs-accordion-btn-color' as any]: textColor,
    ['--bs-accordion-active-bg' as any]: color,
    ['--bs-accordion-active-color' as any]: textColor,
    ['--bs-accordion-icon-color' as any]: textColor,
  } as React.CSSProperties;
}

export const ItemObraCard = ({itemObra, index}: ItemObraCardProps) => {
    const [activeKey, setActiveKey] = useState<string | null>(index === 0 ? itemObra.id.toString() : null); 

    const toogleSelect = useCallback(() => {
        setActiveKey(prev => prev === null ? itemObra.id.toString() : null);
    }, [itemObra.id, activeKey]);
    
    return (
        <Accordion id='detalhes-obra-accordion' activeKey={activeKey} className='max-w-full min-w-0'>
            <Accordion.Item eventKey={itemObra.id.toString()} style={getBgColor(itemObra.ultimaEtapa)}>
                <ItemObraAccordionHeader itemObra={itemObra} active={!!activeKey} toogleActive={toogleSelect}/>
                <Accordion.Body className='px-1'>
                    <ItemObraAccordionTitle id={itemObra.id} ultimaEtapa={itemObra.ultimaEtapa}/>
                    <div className='mt-2'>
                        {itemObra.ultimaEtapa === 'ideacao' && <IdeacaoCard id={itemObra.id}/>}
                        {itemObra.ultimaEtapa === 'orcamento' && <OrcamentoCard id={itemObra.id}/>}
                        {itemObra.ultimaEtapa === 'execucao' && <ExecucaoCard id={itemObra.id}/>}
                        {itemObra.ultimaEtapa === 'finalizado' && <FinalizadoCard id={itemObra.id}/>}
                    </div>
                </Accordion.Body>
            </Accordion.Item >
        </Accordion>
    )
}
