import React from 'react'
import { BsChevronLeft } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { PageWrapper } from './PageWrapper'
import { PageTitleWrapper } from './PageTitleWrapper'

export interface PageLayoutProps {
    children: React.ReactNode, 
    titulo: string, 
    id: string, 
    backPath?: string,
    onClick?: () => void
}

export const PageLayout = ({children, titulo, id, backPath, onClick}: PageLayoutProps) => {    
    return (
        <PageWrapper id={id}>
            <PageTitleWrapper id={id}>
                {backPath ? <Link to={backPath} onClick={onClick} id={`${id}-link-back`} className='flex align-items-center'>
                    <BsChevronLeft className='cursor-pointer mr-2.5 text-[1.25rem] md:text-[2rem] md:mr-4' />
                    <span>{titulo}</span>
                </Link> : titulo}
            </PageTitleWrapper>
            {children}
        </PageWrapper>
    )
}
