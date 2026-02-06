import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { itemsObraActions } from '../../../features/itemsObraSlice';
import type { OutraData } from '../../../types/Execucao';
import { PageLayout } from '../../layout/PageLayout';

type NovaData = Omit<OutraData, 'id'>;

export const OutraDataForm = () => {
    const { idItem, idObra } = useParams<{idItem: string, idObra: string}>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const form = useForm<NovaData>({
        defaultValues: {
            nome: undefined,
            data: new Date().toISOString().split(':')[0] + ':00',
        },
    });
    const { handleSubmit, register, formState: {errors} } = form;

    const submit = useCallback((data: NovaData) => {
        dispatch(itemsObraActions.addOutraData({...data, idItem: idItem ? parseFloat(idItem) : 0}));
        navigate(`/obra/${idObra}`);
    }, [itemsObraActions.addOutraData]);

    const onCancel = useCallback(() => {
        navigate(`/obra/${idObra}`)
    }, []);

    return (
        <PageLayout
            id='nova-data'
            titulo={'Adicionar outra data'}
            backPath={`/${idObra}`}
        >
            <form onSubmit={handleSubmit(submit)} className='lg:w-1/2' noValidate>
                <div className='mb-3'>
                    <p className='mb-2'>Nome: <span className='text-(--red)'>*</span></p>
                    <input
                        className='border border-(--blue)! w-full rounded-md p-2'
                        {...register('nome', { required: 'Nome é obrigatório' })}
                    />
                    {errors.nome && (
                        <span className='text-(--red) text-xs'>{errors.nome.message}</span>
                    )}
                </div>
                <div className='mb-3'>
                    <p className='mb-2'>Data: <span className='text-(--red)'>*</span></p>
                    <input
                        type='datetime-local'
                        className='border border-(--blue)! w-full rounded-md p-2'
                        pattern="\d{4}-\d{2}-\d{2}T\d{2}:\d{2}"
                        {...register('data', { required: 'Data é obrigatória' })}
                    />
                    {errors.data && (
                        <span className='text-(--red) text-xs'>{errors.data.message}</span>
                    )}
                </div>
                <div className='grid gap-2 mb-4'>
                    <button
                        type="submit"
                        className="bg-(--blue) hover:bg-(--blue-2) w-full text-center text-white rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                    >
                        Salvar
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full text-center rounded border-(--blue)! border hover:bg-(--blue) font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </PageLayout>
    )
}
