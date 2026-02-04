import { useFormContext } from 'react-hook-form';
import { BsEnvelope } from 'react-icons/bs';
import type { Usuario } from '../../types/Usuario';

export const InputEmail = () => {
    const { register, formState: {errors} } = useFormContext<Usuario>();

    return (
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
                E-mail <span className='text-(--red)'>*</span>
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BsEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    {...register("email", {
                        required: "Campo obrigatório",
                        pattern: {
                            // Regex simples e suficiente para a maioria dos casos de UI:
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Digite um e-mail válido.",
                        },
                    })}
                    id="email"
                    type="email"                        
                    autoComplete="email"
                    placeholder='seu@email.com'
                    aria-invalid={!!errors.email || undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className='pl-10 border-2 w-full py-2 rounded'
                />
            </div>
            {errors.email && (
                <p id="email-error" role="alert" className='text-(--red) text-sm mt-2'>
                    {errors.email.message}
                </p>
            )}
        </div>
    )
}
