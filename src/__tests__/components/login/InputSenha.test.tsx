import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { InputSenha } from '../../../components/login/InputSenha';

const renderInputSenha = (props = {}) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const methods = useForm({ mode: 'onBlur' });
        return <FormProvider {...methods}>{children}</FormProvider>;
    };
    return render(<InputSenha label="Senha" name="password" id="password" {...props} />, { wrapper: Wrapper });
};

describe('InputSenha Component', () => {
    test('deve validar o comprimento mínimo de 6 caracteres', async () => {
        const user = userEvent.setup();
        renderInputSenha();

        const input = screen.getByPlaceholderText('••••••••');
        
        await user.type(input, '123');
        await user.tab(); 

        await waitFor(() => {
            expect(screen.getByText(/use ao menos 6 caracteres/i)).toBeInTheDocument();
        }, { timeout: 3000 });
  });

    test('deve alternar a visibilidade da senha e ocultar após 1 segundo', async () => {
        const user = userEvent.setup({});
        renderInputSenha();
        const input = screen.getByPlaceholderText('••••••••');
        const button = screen.getByRole('button');

        expect(input).toHaveAttribute('type', 'password');

        await user.click(button);
        expect(input).toHaveAttribute('type', 'text');
  });
});