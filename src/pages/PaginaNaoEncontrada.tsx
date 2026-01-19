import { BsHouseDoor } from 'react-icons/bs';

export default function PaginaNaoEncontrada() {
  return (
    <div className="min-h-screen bg-(--white) w-full flex items-center justify-center px-4 pt-4">
      <div className="w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl! md:text-9xl! font-bold mb-2">404</h1>
          <hr className="h-1 w-32 mx-auto rounded" />
        </div>

        <h2 className="text-3xl font-bold mb-4">
          Página Não Encontrada
        </h2>
        <p className="text-lg mb-8">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-(--white) text-(--main)-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-(--main) rounded-lg shadow-md hover:bg-(--main-2) hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <BsHouseDoor />
            Ir para Início
          </button>
        </div>
      </div>
    </div>
  );
}
