import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export const Layout = () => {
    return (
        <div className='min-h-screen w-full flex flex-col'>
            <Header />
            <main className='pt-10 w-full absolute top-0 left-0 '>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
