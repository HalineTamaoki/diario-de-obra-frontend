import type { ReactNode } from "react";

export const LayoutNaoLogado = ({children}: {children: ReactNode}) => {
    return (
        <div className="min-h-screen bg-linear-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {children}
                </div>

                <p className="mt-6! mb-0 text-center text-sm text-gray-600">
                    © 2026 Diário de Obra. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}