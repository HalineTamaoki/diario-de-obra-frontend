import { useCallback } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LayoutNaoLogado } from '../components/layout/LayoutNaoLogado';
import { InputEmail } from '../components/login/InputEmail';
import { InputSenha } from '../components/login/InputSenha';
import type { Usuario } from '../types/Usuario';

type NovoUsuario = Usuario & {
    confirmacaoSenha: string
}

export const CadastroUsuario = () => {
    const methods = useForm<NovoUsuario>();
    const { handleSubmit, control } = methods;
    const { senha } = useWatch({control});
    const navigate = useNavigate();

    const onSubmit = useCallback((data: NovoUsuario) => {
        //TODO: adicionar salvar usuario
        navigate('/login');
    }, []);

    return (
        <LayoutNaoLogado>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Cadastre-se</h1>
            </div>
            <FormProvider {...methods}>
                <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit, err => console.log(err))}>
                    <InputEmail />
                    <InputSenha 
                        id='senha'
                        name='senha'
                        label='Nova senha'
                    />
                    <InputSenha 
                        id='confirmacaoSenha'
                        name='confirmacaoSenha'
                        label='Confirme a senha'
                        validate = {value => value === senha ? undefined : 'As senhas devem ser iguais.'}
                    />

                    <button
                        type='submit'
                        className="w-full bg-(--main) py-3 px-4 rounded-lg font-medium hover:bg-(--main-2)"
                    >
                        Cadastrar
                    </button>
                </form>
            </FormProvider>
        </LayoutNaoLogado>
    );
}