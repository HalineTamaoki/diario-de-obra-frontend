export const Footer = () => {
    return (
        <footer className='bg-(--secondary) h-10 w-full fixed bottom-0 left-0 z-40 flex items-center justify-center'>
            <span className='text-sm'>© {new Date().getFullYear()} - Desenvolvido por Haline Tamaoki</span>
        </footer>
    )
}