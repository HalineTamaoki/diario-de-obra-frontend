import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddInput } from "../components/common/AddInput";
import { PageLayout } from "../components/layout/PageLayout";
import { ObraCard } from "../components/obra/ObraCard";
import { addObra } from "../features/obraSlice";
import type { Obra as ObraType } from "../types/Obra";

export const Obra = () => {
    const { obras } = useSelector((state: any) => state.obra);
    const dispach = useDispatch();

    const adicionarObra = useCallback((value: string) => {
        dispach(addObra({ nome: value, porcentagem: Math.random() * 100 }));
    }, [dispach]);

    return (
        <PageLayout titulo="Minhas obras" id="minhas-obras">
            <AddInput 
                id='adicionar-obra' 
                placeholder="Adicionar nova obra"
                add={adicionarObra}
                className='md:w-[70%] lg:w-1/2'
            />
            <div>
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
