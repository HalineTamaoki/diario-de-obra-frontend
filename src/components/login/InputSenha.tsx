import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BsEye, BsEyeSlash, BsKey } from 'react-icons/bs'

interface InputSenhaProps {
    label: string, 
    name: string, 
    id: string,
    validate?: (value: string) => string | undefined
}

export const InputSenha = ({ label, name, id, validate}: InputSenhaProps) => {
    const [ mostrarSenha, setMostrarSenha] = useState<boolean>(false);
    const { register, formState: {errors} } = useFormContext();

    const mostrarSenhaOnClick = useCallback(() => {
        setMostrarSenha(true);

        setTimeout(() => {
            setMostrarSenha(false);
        }, 1000)
    }, []);
    
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium mb-2">
                {label} <span className='text-(--red)'>*</span>
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BsKey className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    {...register(name, {
                        required: "Campo obrigatório",
                        minLength: { value: 6, message: "Use ao menos 6 caracteres." },
                        maxLength: { value: 128, message: "Máximo de 128 caracteres." },
                        validate
                    })}
                    id={id}
                    type={mostrarSenha ? 'text' : 'password'}
                    aria-invalid={!!errors.senha || undefined}
                    placeholder="••••••••"
                    className='pl-10 border-2 w-full py-2 rounded'
                />
                    <button
                        type="button"
                        onClick={mostrarSenhaOnClick}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {mostrarSenha ? (
                            <BsEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <BsEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
            </div>
            {errors[name] && (
                <p id="senha-error" role="alert" className='text-(--red) text-sm mt-2'>
                    {errors[name].message as string}
                </p>
            )}
        </div>
    )
}
