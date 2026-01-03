import { useCallback, useMemo, useState } from 'react';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removerObra } from '../../features/obraSlice';
import type { Obra } from '../../types/Obra';
import { AcoesButton } from '../common/AcoesButton';
import { NomeObraInput } from './NomeObraInput';

export const ObraCard = ({obra}: {obra: Obra}) => {
    const [editMode, setEditMode] = useState<boolean>(false);

    const dispach = useDispatch();

    const deletar = useCallback(() => {
        dispach(removerObra(obra.id));
    }, []);

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
                className={`w-full flex justify-between md:py-6! min-w-0 px-4 align-items-center text-decoration-none ${bgColor} ${textColor}`}
                style={{borderRadius: '0.5em'}}
                to={`/${obra.id}`}
            >
                {editMode ? (
                    <NomeObraInput sairModoEdicao={() => setEditMode(false)} obra={obra}/>
                ) : (
                    <button className='truncate max-w-[70%] min-w-0 px-0 py-2.5' onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditMode(true)
                    }}>
                        <span>{obra.nome}</span>
                    </button>
                )}
                <div className='flex gap-3 flex-none align-items-center'>
                    <span>{obra.porcentagem.toFixed(0)}%</span>
                    <AcoesButton 
                        color={textColor} 
                        itens={[
                            {id: 'acoes-obra-deletar', text: 'Deletar', onClick: deletar, className: 'text-(--red)', icon: <BsTrash3 />},
                        ]}
                    />
                </div>
            </Link>
        </>
    )
}
