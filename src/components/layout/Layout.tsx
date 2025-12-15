import type { ReactNode } from 'react'
import { Header } from './Header'

export const Layout = ({children}: {children: ReactNode}) => {
    return (
        <div className='w-full'>
            <Header />
            {children}
        </div>
    )
}
