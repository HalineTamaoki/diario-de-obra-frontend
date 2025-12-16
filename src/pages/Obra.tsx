import { useSelector } from "react-redux";
import { PageLayout } from "../components/layout/PageLayout";
import { AdicionarObraInput } from "../components/obra/AdicionarObraInput";

export const Obra = () => {
    const { obras } = useSelector((state: any) => state.obra);
    
    return (
        <PageLayout titulo="Minhas obras" id="minhas-obras">
            <AdicionarObraInput />
        </PageLayout>
    )
}
