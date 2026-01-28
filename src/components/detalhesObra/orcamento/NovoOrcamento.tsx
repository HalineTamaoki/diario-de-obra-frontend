import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { itemsObraActions } from '../../../features/itemsObraSlice'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { PageLayout } from '../../layout/PageLayout'
import { OrcamentoForm } from './OrcamentoForm'

export const NovoOrcamento = () => {
    const {idObra} = useParams<{idObra: string}>();
    const navigate = useNavigate();
    const dispach = useDispatch();

    const onSubmit = useCallback((data: NovoOrcamentoType) => {
        dispach(itemsObraActions.addOrcamento(data));
        navigate(`/${idObra}`);
    }, [itemsObraActions.addOrcamento]);

    return (
        <PageLayout
            id='novo-orcamento'
            titulo={'Novo orçamento'}
            backPath={`/${idObra}`}
        >
            <OrcamentoForm 
                mostrarCampoEmpresa={true}
                onSubmit={onSubmit}
                onCancel={() => navigate(`/${idObra}`)}
            />   
        </PageLayout>
    )
}
