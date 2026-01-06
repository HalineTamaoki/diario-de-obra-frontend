import { BsThreeDots } from 'react-icons/bs';
import { AcoesButtonItens } from './AcoesButtonItens';
import { AcoesWithChildren } from './AcoesWithChildren';

export const AcoesButton = ({color, itens}: {color?: string, itens: AcoesButtonItens[]}) => {
    return (
        <AcoesWithChildren itens={itens}>
            <BsThreeDots className={color}/>
        </AcoesWithChildren>
    );
}
