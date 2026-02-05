import { useCallback, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LayoutNaoLogado } from '../components/layout/LayoutNaoLogado';
import { InputEmail } from '../components/login/InputEmail';
import { InputSenha } from '../components/login/InputSenha';
import { mostrarNotificacao } from '../features/notificacaoSlice';
import { useCadastrarUsuarioMutation } from '../services/userApi';
import type { Usuario } from '../types/Usuario';

type NovoUsuario = Usuario & {
    confirmacaoSenha: string
}

export const CadastroUsuario = () => {
    const methods = useForm<NovoUsuario>();
    const { handleSubmit, control, setError } = methods;
    const { senha } = useWatch({control});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formError, setFormError] = useState<string>();

    const [cadastrarUsuario, { isLoading }] = useCadastrarUsuarioMutation();

    const onSubmit = useCallback((data: NovoUsuario) => {
        setFormError(undefined);
        cadastrarUsuario({
            email: data.email,
            senha: data.senha
        }).unwrap().then(() => {
            navigate('/login');
            dispatch(mostrarNotificacao({
                mensagem: 'Cadastro realizado com sucesso! Por favor, faça o login.',
                variant: 'success'
            }));
        }).catch(err => {
            if(err.data?.message.includes('email')){
                setError('email', {
                    type: 'manual',
                    message: err.data?.message
                });
            } else {
                setFormError(err.data?.message ?? 'Erro ao cadastrar usuário. Tente novamente mais tarde.');
            }
        });
    }, []);

    return (
        <LayoutNaoLogado>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Cadastre-se</h1>
            </div>
            <FormProvider {...methods}>
                <form className="space-y-6" noValidate onSubmit={handleSubmit(onSubmit, err => console.log(err))}>
                    <InputEmail disabled={isLoading}/>
                    <InputSenha 
                        id='senha'
                        name='senha'
                        label='Nova senha'
                        disabled={isLoading}
                    />
                    <InputSenha 
                        id='confirmacaoSenha'
                        name='confirmacaoSenha'
                        label='Confirme a senha'
                        validate = {value => value === senha ? undefined : 'As senhas devem ser iguais.'}
                        disabled={isLoading}
                    />

                    <button
                        type='submit'
                        disabled={isLoading}
                        className="w-full bg-(--main) py-3 px-4 rounded-lg font-medium hover:bg-(--main-2)"
                    >
                        Cadastrar
                        {isLoading && <Spinner animation="border" size="sm" className="ml-2"/>}
                    </button>
                    {formError && <p className="text-(--red) text-sm mb-1">{formError}</p>}
                </form>
            </FormProvider>
        </LayoutNaoLogado>
    );
}
