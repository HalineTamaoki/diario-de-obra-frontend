import { useCallback } from "react";
import { AddInput } from "../components/common/AddInput";
import { LoadingContainer } from "../components/common/LoadingContainer";
import { PageLayout } from "../components/layout/PageLayout";
import { ObraCard } from "../components/obra/ObraCard";
import { mostrarNotificacao } from "../features/notificacaoSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useCadastrarObraMutation, useObterObrasQuery } from "../services/obraApi";
import type { Obra as ObraType } from "../types/Obra";

export const Obra = () => {
    const [ cadastrarObra, { isLoading }] = useCadastrarObraMutation();
    const { data: obras, isLoading: isLoadingObras } = useObterObrasQuery();
    const dispatch = useAppDispatch();

    const adicionarObra = useCallback((nome: string) => {
        cadastrarObra({ nome }).unwrap()
            .catch((error) => {
                dispatch(mostrarNotificacao({mensagem: error.data?.mensagem ?? 'Erro ao adicionar obra.', variant: 'danger'}));
            })
    }, []);

    return (
        <PageLayout titulo="Minhas obras" id="minhas-obras">
            <LoadingContainer isLoading={isLoadingObras}>
                <AddInput 
                    id='adicionar-obra' 
                    placeholder="Adicionar nova obra"
                    add={adicionarObra}
                    className='md:w-[70%] lg:w-1/2'
                    loading={isLoading}
                />
                <div>
                    {!obras || obras.length === 0 ? (
                        <p className="text-gray-500 text-center md:text-start! md:px-2">Nenhuma obra adicionada.</p>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 w-full">
                            {obras.map((obra: ObraType) => (
                                <ObraCard obra={obra} key={obra.id} /> 
                            ))}
                        </div>
                    )}
                </div>
            </LoadingContainer>
        </PageLayout>
    )
}
