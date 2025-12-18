import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { AdicionarObraInput } from "../components/obra/AdicionarObraInput";
import type { Obra as ObraType } from "../types/Obra";
import { ObraCard } from "../components/obra/ObraCard";

export const Obra = () => {
    const { obras } = useSelector((state: any) => state.obra);
    
    return (
        <PageLayout titulo="Minhas obras" id="minhas-obras">
            <AdicionarObraInput />
            <div className="mt-6">
                {obras.length === 0 ? (
                    <p className="text-gray-500 text-center md:text-start! md:px-2">Nenhuma obra adicionada.</p>
                ) : (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 w-full">
                        {obras.map((obra: ObraType) => (
                            <ObraCard obra={obra} key={obra.id} /> 
                        ))}
                    </div>
                )}
            </div>
        </PageLayout>
    )
}
