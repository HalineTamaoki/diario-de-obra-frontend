import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { editarDetalhesOrcamento } from '../../../features/detalhesOrcamentoSlice'
import { itemsObraActions } from '../../../features/itemsObraSlice'
import type { NovoOrcamentoType, OrcamentoDetalhesType } from '../../../types/Orcamento'
import { OrcamentoDetalhesPageWrapper } from './OrcamentoDetalhesPageWrapper'
import { OrcamentoForm } from './OrcamentoForm'

const mockOrcamento = {
  empresa: 'Test',
  data: new Date().toISOString().split('T')[0],
  idObra: 1,
  id: 1
}

export const OrcamentoDetalhes = () => {
    const { idObra, idOrcamento } = useParams<{idObra: string, idOrcamento: string}>();
    const [orcamento, setOrcamento] = useState<OrcamentoDetalhesType>(mockOrcamento);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);

    //TODO: remover esse useEffect. Ele apenas seta o id da obra como o atual
    useEffect(() => {
        if(idObra && idOrcamento){
            setOrcamento({...orcamento, idObra: parseFloat(idObra), id: parseFloat(idOrcamento)});
        }
    }, [idObra])

    const voltar = useCallback(() => {
        if(editMode){
            setEditMode(false);
        } else {
            navigate(`/${idObra}`);
        }
    }, [editMode, idObra]);

    const editar = useCallback((novoOrcamento: NovoOrcamentoType) => {
        setOrcamento({...orcamento, ...novoOrcamento});
        setEditMode(false);
    }, [editarDetalhesOrcamento]);

    const selecionar = useCallback(() => {
        if(orcamento?.id){
            dispatch(itemsObraActions.selecionarOrcamento({id: orcamento.id, idObra: orcamento.idObra}));
            navigate(`/${idObra}`);
        }
    }, [orcamento, itemsObraActions.selecionarOrcamento]);

    const desselecionar = useCallback(() => {
        if(orcamento?.id){
            dispatch(itemsObraActions.desselecionarOrcamento({id: orcamento.id, idObra: orcamento.idObra}));
            navigate(`/${idObra}`);
        }
    }, [orcamento, itemsObraActions.desselecionarOrcamento]);

    const deletar = useCallback(() => {
        if(orcamento?.id){
            dispatch(itemsObraActions.deletarOrcamento({id: orcamento.id, idObra: orcamento.idObra}));
            navigate(`/${idObra}`);
        }
    }, [orcamento?.id, itemsObraActions.deletarOrcamento]);

    return (
        <OrcamentoDetalhesPageWrapper 
            voltar={voltar} 
            editMode={editMode} 
            setEditMode={setEditMode}
            orcamento={orcamento}
            editar={editar}
        >
            {editMode && orcamento ? (
                <OrcamentoForm onSubmit={editar} valorInicial={orcamento} onCancel={() => setEditMode(false)}/>
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
                            id='orcamento-detalhes-sobre'
                            className="bg-(--grey) hover:bg-(--grey-2) w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                        >
                            Sobre a empresa
                        </button>
                        <button
                            id='orcamento-detalhes-selecionar'
                            onClick={orcamento.selecionado ? desselecionar : selecionar}
                            className="bg-(--secondary) hover:bg-(--secondary-2) w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                        >
                            {orcamento.selecionado ? 'Desselecionar' : 'Marcar como selecionado'}
                        </button>
                        <button
                            id='orcamento-detalhes-deletar'
                            onClick={deletar}
                            className="border-(--secondary)! hover:bg-(--secondary) border w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                        >
                            Deletar
                        </button>
                    </div>}
                </div>
            )}
        </OrcamentoDetalhesPageWrapper>
    )
}
