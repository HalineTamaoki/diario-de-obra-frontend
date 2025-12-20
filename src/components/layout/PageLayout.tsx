import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'

export const PageLayout = ({children, titulo, id, backPath}: {children: React.ReactNode, titulo: string, id?: string, backPath?: string}) => {    
    return (
        <div className='min-h-screen w-full flex flex-col px-4 py-8 md:px-16 md:py-12' id={id}>
            <h1 className='pb-4 md:pb-8' id={`${id}-title`}>
                {backPath ? <Link to={backPath} id={`${id}-link-back`}>
                    <BsChevronLeft className='cursor-pointer mr-2.5' />
                    <span>{titulo}</span>
                </Link> : titulo}
            </h1>
            {children}
        </div>
    )
}
