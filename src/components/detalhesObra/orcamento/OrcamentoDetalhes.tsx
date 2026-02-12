import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { mostrarNotificacao } from '../../../features/notificacaoSlice'
import { useDeletarOrcamentoMutation, useEditarOrcamentoMutation, useObterOrcamentoDetalhesQuery, useSelecionarOrcamentoMutation } from '../../../services/orcamentoApi'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { ButtonSpinner } from '../../common/ButtonSpinner'
import { LoadingContainer } from '../../common/LoadingContainer'
import { OrcamentoDetalhesPageWrapper } from './OrcamentoDetalhesPageWrapper'
import { OrcamentoForm } from './OrcamentoForm'

export const OrcamentoDetalhes = () => {
    const { idObra, idItem, idOrcamento } = useParams<{idObra: string, idItem: string, idOrcamento: string}>();
    const idObraNum = parseFloat(idObra!);
    const idItemNum = parseFloat(idItem!);
    const idOrcamentoNum = parseFloat(idOrcamento!);
    
    const { data: orcamento, isLoading } = useObterOrcamentoDetalhesQuery({id: idOrcamentoNum});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [ editarOrcamento, { isLoading: isEditarOrcamentoLoading }] = useEditarOrcamentoMutation();
    const [ selecionarOrcamento, { isLoading: isSelecionarOrcamentoLoading }] = useSelecionarOrcamentoMutation();
    const [ deletarOrcamento, { isLoading: isDeletarOrcamentoLoading }] = useDeletarOrcamentoMutation();

    const voltar = useCallback(() => {
        if(editMode){
            setEditMode(false);
        } else {
            navigate(`/obra/${idObra}`);
        }
    }, [editMode, idObra]);

    const editar = useCallback((novoOrcamento: NovoOrcamentoType) => {
        editarOrcamento({...novoOrcamento, id: idOrcamentoNum, idItem: idItemNum, idObra: idObraNum})
            .unwrap()
            .then(() => setEditMode(false))
            .catch(error => dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao editar orçamento.'})));
    }, [orcamento]);

    const selecionar = useCallback(() => {
        if(idOrcamentoNum){
            selecionarOrcamento({id: idOrcamentoNum, idItem: idItemNum, idObra: idObraNum, selecionado: !orcamento?.selecionado})
                .unwrap()
                .then(() => navigate(`/obra/${idObra}`))
                .catch(error => {
                    dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao selecionar orçamento.'}));
                });
        }
    }, [orcamento, selecionarOrcamento, dispatch, idObra, idItem, idOrcamento]);

    const deletar = useCallback(() => {
        deletarOrcamento({id: idOrcamentoNum, idItem: idItemNum, idObra: idObraNum})
            .unwrap()
            .then(() => navigate(`/obra/${idObra}`))
            .catch(error => {
                dispatch(mostrarNotificacao({variant: 'danger', mensagem: error.data?.message ?? 'Erro ao deletar orçamento.'}));
            });
    }, [idOrcamentoNum, idItemNum, idObra]);

    return (<LoadingContainer isLoading={isLoading}>
        {orcamento && <OrcamentoDetalhesPageWrapper 
            voltar={voltar} 
            editMode={editMode} 
            setEditMode={setEditMode}
            orcamento={orcamento}
            editar={editar}
        >
            {editMode && orcamento ? (
                <OrcamentoForm onSubmit={editar} valorInicial={orcamento} onCancel={() => setEditMode(false)} loading={isEditarOrcamentoLoading}/>
            ) : (
                <div className='w-full gap-2 grid lg:w-1/2'>
                    <p className='mb-0'>
                        Valor: <span className='w-full' onClick={() => setEditMode(true)}>R${orcamento?.valor ?? '-'}</span>
                    </p>
                    <p className='mb-0'>
                        Data do envio: <span className='w-full' onClick={() => setEditMode(true)}>{orcamento?.data ?? '-'}</span>
                    </p>
                    <p className='mb-0'>
                        Comentários:
                    </p>
                    <p className='mb-0 border-1 border-(--secondary) p-2 rounded min-h-30' onClick={() => setEditMode(true)}>
                        {orcamento?.comentarios}
                    </p>
                    {orcamento && <div className='mt-2 grid gap-2'>
                        <button
                            id='orcamento-detalhes-selecionar'
                            onClick={selecionar}
                            className="bg-(--secondary) hover:bg-(--secondary-2) w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                            disabled={isDeletarOrcamentoLoading || isSelecionarOrcamentoLoading}
                        >
                            {orcamento.selecionado ? 'Desselecionar' : 'Marcar como selecionado'}
                            <ButtonSpinner loading={isSelecionarOrcamentoLoading}/>
                        </button>
                        <button
                            id='orcamento-detalhes-deletar'
                            onClick={deletar}
                            className="border-(--secondary)! hover:bg-(--secondary) border w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                            disabled={isDeletarOrcamentoLoading || isSelecionarOrcamentoLoading}
                        >
                            Deletar
                            <ButtonSpinner loading={isDeletarOrcamentoLoading}/>
                        </button>
                    </div>}
                </div>
            )}
        </OrcamentoDetalhesPageWrapper>}
    </LoadingContainer>)
}
