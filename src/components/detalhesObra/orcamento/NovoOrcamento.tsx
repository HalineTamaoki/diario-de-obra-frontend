import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { mostrarNotificacao } from '../../../features/notificacaoSlice'
import { useAddOrcamentoMutation } from '../../../services/orcamentoApi'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { PageLayout } from '../../layout/PageLayout'
import { OrcamentoForm } from './OrcamentoForm'

export const NovoOrcamento = () => {
    const {idObra} = useParams<{idObra: string}>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [ adicionarOrcamento, { isLoading }] = useAddOrcamentoMutation();

    const onSubmit = useCallback((data: NovoOrcamentoType) => {
        adicionarOrcamento({...data, idObra: parseFloat(idObra!)})
                    .unwrap()
                    .then(() => navigate(`/obra/${idObra}`))
                    .catch(error => dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao adicionar orçamento.'})));
    }, [adicionarOrcamento, idObra, navigate, dispatch]);

    return (
        <PageLayout
            id='novo-orcamento'
            titulo={'Novo orçamento'}
            backPath={`/obra/${idObra}`}
        >
            <OrcamentoForm 
                mostrarCampoEmpresa={true}
                onSubmit={onSubmit}
                onCancel={() => navigate(`/obra/${idObra}`)}
                loading={isLoading}
            />   
        </PageLayout>
    )
}
