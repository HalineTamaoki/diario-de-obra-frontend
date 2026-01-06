import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import type { RootState } from '../../../app/store'
import { editarDetalhesOrcamento } from '../../../features/detalhesOrcamentoSlice'
import { deletarOrcamento, desselecionarOrcamento, selecionarOrcamento } from '../../../features/orcamentoSlice'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { OrcamentoDetalhesPageWrapper } from './OrcamentoDetalhesPageWrapper'
import { OrcamentoForm } from './OrcamentoForm'

export const OrcamentoDetalhes = () => {
    const { idObra, idOrcamento } = useParams<{idObra: string, idOrcamento: string}>();
    const { orcamento } = useSelector((state: RootState) => state.detalhesOrcamento);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState<boolean>(false);

    //TODO: remover esse useEffect. Ele apenas seta o id da obra como o atual
    useEffect(() => {
        if(idObra && idOrcamento){
            dispatch(editarDetalhesOrcamento({idObra: parseFloat(idObra), id: parseFloat(idOrcamento)}));
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
        console.log(novoOrcamento);
        dispatch(editarDetalhesOrcamento(novoOrcamento));
        setEditMode(false);
    }, [editarDetalhesOrcamento]);

    const selecionar = useCallback(() => {
        if(orcamento?.id){
            dispatch(selecionarOrcamento(orcamento.id));
            navigate(`/${idObra}`);
        }
    }, [orcamento?.id]);

    const desselecionar = useCallback(() => {
        if(orcamento?.id){
            dispatch(desselecionarOrcamento(orcamento.id));
            navigate(`/${idObra}`);
        }
    }, [orcamento?.id]);

    const deletar = useCallback(() => {
        if(orcamento?.id){
            dispatch(deletarOrcamento(orcamento.id));
            navigate(`/${idObra}`);
        }
    }, [orcamento?.id]);

    return (
        <OrcamentoDetalhesPageWrapper voltar={voltar} editMode={editMode} setEditMode={setEditMode}>
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
