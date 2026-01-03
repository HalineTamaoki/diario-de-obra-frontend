import { useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import type { NovoOrcamentoType } from '../../../types/Orcamento'
import { OrcamentoDetalhesPageLayout } from './OrcamentoDetalhesPageLayout'
import { useDispatch } from 'react-redux'
import { addOrcamento } from '../../../features/orcamentoSlice'

export const NovoOrcamento = () => {
    const {idObra} = useParams<{idObra: string}>();
    const form = useForm<NovoOrcamentoType>({
        defaultValues: {
            idObra: idObra  ? parseInt(idObra) : 0,
            data: new Date().toISOString().split('T')[0],
        },
    });
    const navigate = useNavigate();
    const { control, setValue, handleSubmit, register, formState: {errors} } = form;
    const { empresa } = useWatch({control});
    const dispach = useDispatch();

    const editarNome = useCallback((novoNome: string) => setValue('empresa', novoNome), []);

    const onSubmit = useCallback((data: NovoOrcamentoType) => {
        dispach(addOrcamento(data));
        navigate(`/${idObra}`);
    }, [addOrcamento]);

    return (
        <OrcamentoDetalhesPageLayout
            id='novo-orcamento'
            titulo={empresa ?? ''}
            editarNome={editarNome}
            defaultValue='Nome do fornecedor'
            initialEditMode={true}
        >
            <form onSubmit={handleSubmit(onSubmit)} className='lg:w-1/2'>
                <div className='mb-3'>
                    <p className='mb-2'>Empresa: <span className='text-(--red)'>*</span></p>
                    <input
                        type='text'
                        className='border border-(--secondary)! w-full rounded-md p-2'
                        {...register('empresa', { required: 'Empresa é obrigatória' })}
                    />
                    {errors.empresa && (
                        <span style={{ color: 'red' }}>{errors.empresa.message}</span>
                    )}
                </div>
                <div className='mb-3'>
                    <p className='mb-2'>Valor:</p>
                    <input
                        type='number'
                        className='border border-(--secondary)! w-full rounded-md p-2'
                        {...register('valor', {valueAsNumber: true})}
                    />
                </div>
                <div className='mb-3'>
                    <p className='mb-2'>Data: <span className='text-(--red)'>*</span></p>
                    <input
                        type='date'
                        className='border border-(--secondary)! w-full rounded-md p-2'
                        {...register('data', { required: 'Data é obrigatória' })}
                    />
                    {errors.data && (
                        <span style={{ color: 'red' }}>{errors.data.message}</span>
                    )}
                </div>
                <div className='mb-3'>
                    <p className='mb-2'>Comentários:</p>
                    <textarea
                        rows={3}
                        className='border border-(--secondary)! w-full rounded-md p-2'
                        {...register('comentarios')}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-(--secondary) w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                >
                    Salvar
                </button>
            </form>
        </OrcamentoDetalhesPageLayout>
    )
}
