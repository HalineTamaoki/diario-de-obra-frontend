
export const AcaoButton = ({onClick, children, id, className, disabled}: {onClick: (e: any) => void, children: React.ReactNode, id: string, className?: string, disabled?: boolean}) => {
    return (
        <button 
            className={`flex gap-2 w-full align-items-center px-1 py-0 ${className ?? ''}`} 
            id={id} 
            onClick={onClick}
            disabled={disabled}
            onMouseDownCapture={e => e.stopPropagation()}
        >
            {children}
        </button>
    )
}