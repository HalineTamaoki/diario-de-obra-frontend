import { useMemo } from 'react'
import type { Obra } from '../../types/Obra'

export const ObraCard = ({obra}: {obra: Obra}) => {
    const bgColor = useMemo(() => {
        const { porcentagem } = obra;
        if (porcentagem == 0){
            return 'bg-(--main) hover:bg-(--main-2)'
        } else if (porcentagem < 33){
            return 'bg-(--secondary) hover:bg-(--secondary-2)'
        } else if (porcentagem <= 75){
            return 'bg-(--blue) text-(--white) hover:bg-(--blue-2)'
        } else return 'bg-(--green) hover:bg-(--green-2)'
    }, [obra.porcentagem]);

    return (
        <button 
            id={`obra-card-${obra.id}`}
            className={`w-full flex justify-between md:py-6! min-w-0 ${bgColor}`}
            style={{borderRadius: '0.5em'}}
        >
            <span className='truncate max-w-[70%] min-w-0'>{obra.nome}</span>
            <div className='flex gap-3 flex-none'>
                <span>{obra.porcentagem.toFixed(0)}%</span>
                <i className="bi bi-three-dots"></i>
            </div>
        </button>
    )
}
