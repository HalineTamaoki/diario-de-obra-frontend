import { useCallback, useState, type ReactNode } from 'react'
import { BsChevronLeft, BsPencilFill } from 'react-icons/bs'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../../../app/store'
import { editarDetalhesOrcamento } from '../../../features/detalhesOrcamentoSlice'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { NomeInput } from '../../common/NomeInput'
import { PageTitleWrapper } from '../../layout/PageTitleWrapper'
import { PageWrapper } from '../../layout/PageWrapper'

interface OrcamentoDetalhesPageWrapperProps {
    children: ReactNode, 
    editMode: boolean, 
    voltar?: () => void, 
    setEditMode: (editMode: boolean) => void
}

export const OrcamentoDetalhesPageWrapper = ({children, editMode, voltar, setEditMode}: OrcamentoDetalhesPageWrapperProps) => {
    const { orcamento } = useSelector((state: RootState) => state.detalhesOrcamento);
    const [nomeEditMode, setNomeEditMode] = useState<boolean>(editMode);
    const dispatch = useDispatch();

    const editar = useCallback((key: keyof NovoOrcamentoType, value: string | number) => {
        dispatch(editarDetalhesOrcamento({[key]: value}));
    }, [editarDetalhesOrcamento]);

    const enterEditMode = useCallback(() => {
        setNomeEditMode(true);
        setEditMode(true);
    }, []);

    return (
        <PageWrapper id='detalhes-orcamento'>
            <PageTitleWrapper id='detalhes-orcamento-title'>
                <button onClick={voltar} id={'detalhes-orcamento-back'} className='p-0 flex align-items-center'>
                    <BsChevronLeft className='cursor-pointer mr-2.5 text-[1.25rem] md:text-[2rem] md:mr-4' />
                </button>
                {nomeEditMode ? (
                    <NomeInput 
                        id='detalhes-orcamento-input'
                        valorInicial={orcamento?.empresa ?? ''}
                        defaultValue={orcamento?.empresa ?? 'Nome da empresa'}
                        editar={nome => editar('empresa', nome)} 
                        sairModoEdicao={() => setNomeEditMode(false)}
                    />
                ) : (
                    <button className='truncate min-w-0 w-full px-0 py-0 flex align-items-center gap-2' onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        enterEditMode()
                    }}>
                        <span className='font-semibold'>{orcamento?.empresa ?? ''}</span>
                        <span><BsPencilFill className='text-xl md:text-2xl md:ml-6'/></span>
                    </button>
                )}
            </PageTitleWrapper>
            {children}
        </PageWrapper>
    )
}
