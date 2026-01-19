import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BsHammer } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutNaoLogado } from '../components/layout/LayoutNaoLogado';
import { InputEmail } from '../components/login/InputEmail';
import { InputSenha } from '../components/login/InputSenha';
import { login } from '../features/authSlice';
import { useAppDispatch } from '../hooks/useAppDispatch';
import type { Usuario } from '../types/Usuario';

export const Login = () => {
    const methods = useForm<Usuario>();
    const { handleSubmit } = methods;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onSubmit = useCallback((data: Usuario) => {
        dispatch(login(data)).unwrap().then(() => {
            navigate('/');
        });
    }, []);

    return (
        <LayoutNaoLogado>
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-(--main) rounded-full mb-4">
                    <BsHammer className="w-8 h-8 text-(--white)" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Diário de Obra</h1>
                <p>Faça login para continuar</p>
            </div>
            <FormProvider {...methods}>
                <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit, err => console.log(err))}>
                    <InputEmail />
                    <InputSenha 
                        id='senha'
                        name='senha'
                        label='Nova senha'
                    />

                    <button
                        type='submit'
                        className="w-full bg-(--main) py-3 px-4 rounded-lg font-medium hover:bg-(--main-2)"
                    >
                        Entrar
                    </button>
                </form>
            </FormProvider>

            <p className="mt-6! mb-0 text-center text-sm text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="font-medium text-orange-500 hover:text-orange-600">
                    Cadastre-se
                </Link>
            </p>
        </LayoutNaoLogado>
    );
}