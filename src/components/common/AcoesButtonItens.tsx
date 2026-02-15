import React from 'react'
import { AcaoButton } from './AcaoButton'
import { useMediaQuery } from 'react-responsive';

export interface AcoesButtonItens {
    onClick: (e: MouseEvent) => void,
    text: string,
    className?: string,
    id: string,
    icon: React.ReactNode
}

export const AcoesButtonItens = ({itens, handleClose, disabled}: {itens: AcoesButtonItens[], handleClose: () => void, disabled?: boolean}) => {
    const isMd = useMediaQuery({ minWidth: 768 });

    return (
        <>
            {itens.map((item, index) => (
                <div key={item.id}>
                    <AcaoButton 
                        key={item.id}
                        id={item.id} 
                        disabled={disabled}
                        onClick={(e) => {
                            handleClose();
                            item.onClick(e);
                        }} 
                        className={item.className}
                    >
                        {item.icon}
                        {item.text}
                    </AcaoButton>
                    {isMd && index !== itens.length -1 && <hr className='m-1.5' key={item.id+'-hr'}/>}
                </div>
            ))}
        </>
    )
}
