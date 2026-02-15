import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';
import { InputEmail } from '../../../components/login/InputEmail';
import userEvent from '@testing-library/user-event';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
    const methods = useForm({
        defaultValues: { email: '' },
        mode: 'onBlur'
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('InputEmail Component', () => {

    test('deve renderizar o input com o placeholder correto', () => {
        render(
            <FormWrapper>
                <InputEmail />
            </FormWrapper>
        );

        const input = screen.getByPlaceholderText(/seu@email.com/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'email');
    });

    test('deve permitir digitar um e-mail', async () => {
        const user = userEvent.setup();
        render(
            <FormWrapper>
                <InputEmail />
            </FormWrapper>
        );

        const input = screen.getByPlaceholderText(/seu@email.com/i) as HTMLInputElement;
        await user.type(input, 'teste@dominio.com');
        
        expect(input.value).toBe('teste@dominio.com');
    });

    test('deve exibir mensagem de erro para e-mail inválido após o blur', async () => {
        const user = userEvent.setup();
        render(
            <FormWrapper>
                <InputEmail />
            </FormWrapper>
        );

        const input = screen.getByPlaceholderText(/seu@email.com/i);
        
        await user.type(input, 'email-invalido');
        await user.tab(); 

        await waitFor(() => {
            expect(screen.getByText(/digite um e-mail válido/i)).toBeInTheDocument();
        });
        
        expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('deve estar desabilitado quando a prop disabled for passada', () => {
        render(
            <FormWrapper>
                <InputEmail disabled={true} />
            </FormWrapper>
        );

        const input = screen.getByPlaceholderText(/seu@email.com/i);
        expect(input).toBeDisabled();
    });
});