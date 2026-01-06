import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs';
import { AcoesButtonItens } from './AcoesButtonItens';
import { AcoesWithChildren } from './AcoesWithChildren';

export const AcoesButton = ({color, itens, direction = 'horizontal', btnClassName}: {color?: string, itens: AcoesButtonItens[], direction?: 'horizontal' | 'vertical', btnClassName?: string}) => {
    return (
        <AcoesWithChildren itens={itens} btnClassName={btnClassName}>
            {direction === 'horizontal' ? <BsThreeDots className={color}/> : <BsThreeDotsVertical className={color}/>}
        </AcoesWithChildren>
    );
}
