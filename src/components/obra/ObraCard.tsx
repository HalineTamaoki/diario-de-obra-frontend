import { useMemo, useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import type { Obra } from '../../types/Obra';
import { AcaoButton } from '../common/AcaoButton';
import { AcoesButton } from '../common/AcoesButton';
import { DeletarObraButton } from './DeletarObraButton';
import { EditarNomeObraInput } from './EditarNomeObraInput';

export const ObraCard = ({obra}: {obra: Obra}) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const bgColor = useMemo(() => {
        const { porcentagem } = obra;
        if (porcentagem == 0){
            return 'bg-(--main) hover:bg-(--main-2)'
        } else if (porcentagem < 33){
            return 'bg-(--secondary) hover:bg-(--secondary-2)'
        } else if (porcentagem <= 75){
            return 'bg-(--blue) hover:bg-(--blue-2)'
        } else return 'bg-(--green) hover:bg-(--green-2)'
    }, [obra.porcentagem]);

    const textColor = useMemo(() => obra.porcentagem > 33 && obra.porcentagem <= 75 ? 'text-white' : 'text-(--black)!', [obra.porcentagem]);

    return (
        <>
            <Link 
                id={`obra-card-${obra.id}`}
                className={`w-full flex justify-between md:py-6! min-w-0 px-4 py-2 text-decoration-none ${bgColor} ${textColor}`}
                style={{borderRadius: '0.5em'}}
                to={`/${obra.nome}`}
                state={{id: obra.id}}
            >
                {editMode ? (
                    <EditarNomeObraInput valorInicial={obra.nome} sairModoEdicao={() => setEditMode(false)} />
                ) : (
                    <span className='truncate max-w-[70%] min-w-0 p-0'>{obra.nome}</span>
                )}
                <div className='flex gap-3 flex-none'>
                    <span>{obra.porcentagem.toFixed(0)}%</span>
                    <AcoesButton color={textColor}>
                        <DeletarObraButton idObra={obra.id} />
                        <AcaoButton id='acoes-obra-editar' onClick={() => setEditMode(true)}>
                            <BsPencil />
                            Editar
                        </AcaoButton>
                    </AcoesButton>
                </div>
            </Link>
        </>
    )
}
