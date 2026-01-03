import { type ReactNode } from 'react'

export const PageTitleWrapper = ({id, children, className}: {id: string, children: ReactNode, className?: string}) => {
    return (
        <h1 className={`pb-4 md:pb-8 flex ${className || ''}`} id={`${id}-title`}>
            {children}
        </h1>
    )
}
