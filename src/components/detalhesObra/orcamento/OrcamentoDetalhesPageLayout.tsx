import { useState } from 'react'
import { BsChevronLeft, BsPencilFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { NomeInput } from '../../common/NomeInput'
import type { PageLayoutProps } from '../../layout/PageLayout'
import { PageTitleWrapper } from '../../layout/PageTitleWrapper'
import { PageWrapper } from '../../layout/PageWrapper'

interface OrcamentoDetalhesPageLayoutProps extends Omit<PageLayoutProps, 'backPath'> {
    editarNome: (novoNome: string) => void;
    defaultValue?: string;
    initialEditMode?: boolean;
}

export const OrcamentoDetalhesPageLayout = ({children, titulo, id, defaultValue, initialEditMode, editarNome}: OrcamentoDetalhesPageLayoutProps) => {
    const { idObra } = useParams<{idObra: string}>();
    const [editMode, setEditMode] = useState<boolean>(initialEditMode ?? false);

    return (
        <PageWrapper id={id}>
            <PageTitleWrapper id={id}>
                <Link to={`/${idObra}`} id={`${id}-link-back`} className='flex align-items-center'>
                    <BsChevronLeft className='cursor-pointer mr-2.5 text-[1.25rem] md:text-[2rem] md:mr-4' />
                </Link>
                {editMode ? (
                    <NomeInput 
                        id={`${id}-input`}
                        valorInicial={titulo}
                        defaultValue={defaultValue ?? 'Nome'}
                        editar={editarNome} 
                        sairModoEdicao={() => setEditMode(false)}
                    />
                ) : (
                    <button className='truncate min-w-0 w-full px-0 py-0 flex align-items-center gap-2' onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditMode(true)
                    }}>
                        <span className='font-semibold'>{titulo}</span>
                        <span><BsPencilFill className='text-xl md:text-2xl md:ml-6'/></span>
                    </button>
                )}
            </PageTitleWrapper>
            {children}
        </PageWrapper>
    )
}
