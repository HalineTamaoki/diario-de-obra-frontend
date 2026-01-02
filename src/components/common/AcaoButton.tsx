
export const AcaoButton = ({onClick, children, id, className}: {onClick: (e: any) => void, children: React.ReactNode, id: string, className?: string}) => {
    return (
        <button 
            className={`flex gap-2 w-full align-items-center px-1 py-0 ${className ?? ''}`} 
            id={id} 
            onClick={onClick}
            onMouseDownCapture={e => e.stopPropagation()}
        >
            {children}
        </button>
    )
}