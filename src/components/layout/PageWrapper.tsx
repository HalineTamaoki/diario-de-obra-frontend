import React from 'react'

interface PageWrapperProps {
    children: React.ReactNode, 
    id?: string, 
}

export const PageWrapper = ({children, id}: PageWrapperProps) => {    
    return (
        <div className='min-h-screen w-full flex flex-col px-4 py-8 md:px-16 md:py-12' id={id}>
            {children}
        </div>
    )
}
