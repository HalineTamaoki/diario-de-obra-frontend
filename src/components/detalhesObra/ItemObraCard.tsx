import { Accordion } from 'react-bootstrap'
import type { ItemObra } from '../../types/DetalhesObra'
import { ItemObraAccordionHeader } from './ItemObraAccordionHeader'
import { ItemObraAccordionTitle } from './ItemObraAccordionTitle'
import { ExecucaoCard } from './execucao/ExecucaoCard'
import { FinalizadoCard } from './finalizado/FinalizadoCard'
import { IdeacaoCard } from './ideacao/IdeacaoCard'
import { OrcamentoCard } from './orcamento/OrcamentoCard'

interface ItemObraCardProps {
    itemObra: ItemObra,
    open: boolean,
    toogleAccordionState: (itemId: number) => void,
    idObra: number,
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

export const ItemObraCard = ({itemObra, open, toogleAccordionState, idObra}: ItemObraCardProps) => {
    return (
        <Accordion id='detalhes-obra-accordion' activeKey={open ? itemObra.id.toString() : null} className='max-w-full min-w-0'>
            <Accordion.Item eventKey={itemObra.id.toString()} style={getBgColor(itemObra.ultimaEtapa)}>
                <ItemObraAccordionHeader itemObra={itemObra} active={open} toogleActive={() => toogleAccordionState(itemObra.id)} idObra={idObra}/>
                <Accordion.Body className='px-1'>
                    <ItemObraAccordionTitle id={itemObra.id} ultimaEtapa={itemObra.ultimaEtapa}/>
                    <div className='mt-2'>
                        {itemObra.ultimaEtapa === 'ideacao' && <IdeacaoCard id={itemObra.id} idObra={idObra}/>}
                        {itemObra.ultimaEtapa === 'orcamento' && <OrcamentoCard id={itemObra.id}/>}
                        {itemObra.ultimaEtapa === 'execucao' && <ExecucaoCard id={itemObra.id}/>}
                        {itemObra.ultimaEtapa === 'finalizado' && <FinalizadoCard id={itemObra.id}/>}
                    </div>
                </Accordion.Body>
            </Accordion.Item >
        </Accordion>
    )
}
