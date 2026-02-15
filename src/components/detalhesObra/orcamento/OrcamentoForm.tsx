import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import type { NovoOrcamentoType } from '../../../types/Orcamento';
import { useCallback } from 'react';
import { ButtonSpinner } from '../../common/ButtonSpinner';
import { formatValue } from '../../../utils/DateUtils';

interface OrcamentoFormProps {
    onSubmit: (data: NovoOrcamentoType) => void,
    onCancel: () => void,
    mostrarCampoEmpresa?: boolean,
    valorInicial?: NovoOrcamentoType,
    loading?: boolean
}

export const OrcamentoForm = ({onSubmit, onCancel, mostrarCampoEmpresa, valorInicial, loading}: OrcamentoFormProps) => {
    const {idItem} = useParams<{idItem: string}>();
    const form = useForm<NovoOrcamentoType>({
        defaultValues: valorInicial ? {
            ...valorInicial,
            data: formatValue('date', valorInicial.data)
        } : {
            idItem: idItem ? parseFloat(idItem) : 0,
            data: formatValue('date', new Date().toISOString().split(':')[0] + ':00:00Z'),
        },
    });
    const { handleSubmit, register, formState: {errors} } = form;

    const submit = useCallback((data: NovoOrcamentoType) => {
        if(Number.isNaN(data.valor)) {
            data.valor = undefined;
        }
        onSubmit({
            ...data,
            data: `${data.data}T00:00:00-03:00`
        });
    }, [onSubmit]);

    return (
        <form onSubmit={handleSubmit(submit)} className='lg:w-1/2' noValidate>
            {mostrarCampoEmpresa && <div className='mb-3'>
                <p className='mb-2'>Empresa: <span className='text-(--red)'>*</span></p>
                <input
                    type='text'
                    className='border border-(--secondary)! w-full rounded-md p-2'
                    disabled={loading}
                    {...register('empresa', { required: 'Empresa é obrigatória' })}
                />
                {errors.empresa && (
                    <span className='text-(--red) text-xs'>{errors.empresa.message}</span>
                )}
            </div>}
            <div className='mb-3'>
                <p className='mb-2'>Valor:</p>
                <input
                    type='number'
                    step={0.01}
                    className='border border-(--secondary)! w-full rounded-md p-2'
                    disabled={loading}
                    {...register('valor', {
                        valueAsNumber: true,
                        validate: (v) => {
                            if (v === undefined || v === null || Number.isNaN(v)) return;
                            const temDecimais = Math.abs(v % 1) > 0;
                            if (!temDecimais) return true;
                            const casas = v.toString().split('.')[1]?.length || 0;
                            return casas <= 2 || 'Use no máximo 2 casas decimais';
                        },
                    })}
                />
                {errors.valor && (
                    <span className='text-(--red) text-xs'>{errors.valor.message}</span>
                )}
            </div>
            <div className='mb-3'>
                <p className='mb-2'>Data: <span className='text-(--red)'>*</span></p>
                <input
                    type='date'
                    className='border border-(--secondary)! w-full rounded-md p-2'
                    disabled={loading}
                    {...register('data', { required: 'Data é obrigatória' })}
                />
                {errors.data && (
                    <span className='text-(--red) text-xs'>{errors.data.message}</span>
                )}
            </div>
            <div className='mb-3'>
                <p className='mb-2'>Comentários:</p>
                <textarea
                    rows={3}
                    className='border border-(--secondary)! w-full rounded-md p-2'
                    disabled={loading}
                    {...register('comentarios')}
                />
            </div>
            <div className='grid gap-2 mb-4'>
                <button
                    type="submit"
                    className="bg-(--secondary) hover:bg-(--secondary-2) w-full text-center rounded font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                    disabled={loading}
                >
                    Salvar
                    <ButtonSpinner loading={loading}/>
                </button>
                <button
                    onClick={onCancel}
                    className="w-full text-center rounded border-(--secondary)! border hover:bg-(--secondary) font-semibold! shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
                    disabled={loading}
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}
