import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { AcoesButtonItens } from './AcoesButtonItens';
import { AcoesWithChildren } from './AcoesWithChildren';

interface AcoesButtonProps {
    color?: string, 
    itens: AcoesButtonItens[], 
    direction?: 'horizontal' | 'vertical', 
    btnClassName?: string,
    loading?: boolean
}

export const AcoesButton = ({color, itens, direction = 'horizontal', btnClassName, loading}: AcoesButtonProps) => {
    return (
        <AcoesWithChildren itens={itens} btnClassName={btnClassName} disabled={loading}>
            {direction === 'horizontal' ? <BsThreeDots className={color}/> : <BsThreeDotsVertical className={color}/>}
        </AcoesWithChildren>
    );
}
