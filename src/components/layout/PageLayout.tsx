import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'

interface PageLayoutProps {
    children: React.ReactNode, 
    titulo: string, 
    id?: string, 
    backPath?: string,
    headerChildren?: React.ReactNode,
    headerClassName?: string,
}

export const PageLayout = ({children, titulo, id, backPath, headerChildren, headerClassName}: PageLayoutProps) => {    
    return (
        <div className='min-h-screen w-full flex flex-col px-4 py-8 md:px-16 md:py-12' id={id}>
            <h1 className={`pb-4 md:pb-8 flex ${headerClassName}`} id={`${id}-title`}>
                {backPath ? <Link to={backPath} id={`${id}-link-back`} className='flex align-items-center'>
                    <BsChevronLeft className='cursor-pointer mr-2.5 text-[1.25rem]' />
                    <span>{titulo}</span>
                </Link> : titulo}
                {headerChildren}
            </h1>
            {children}
        </div>
    )
}
