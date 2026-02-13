import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { CadastroUsuario } from '../../pages/CadastroUsuario';
import * as userApi from '../../services/userApi';
import * as notificacaoSlice from '../../features/notificacaoSlice';
import type { ReactNode } from 'react';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

vi.mock('../../services/userApi', () => ({
    useCadastrarUsuarioMutation: vi.fn(),
}));

vi.mock('../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

vi.mock('../../components/layout/LayoutNaoLogado', () => ({
    LayoutNaoLogado: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

describe('CadastroUsuario Page', () => {
    const useCadastrarMock = vi.mocked(userApi.useCadastrarUsuarioMutation);

    beforeEach(() => {
        vi.clearAllMocks();
        useCadastrarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
    });

    const renderCadastro = () => render(<CadastroUsuario />, { wrapper: BrowserRouter });

    test('deve exibir erro se as senhas forem diferentes', async () => {
        const user = userEvent.setup({ delay: null });
        renderCadastro();

        const senhaInput = screen.getByLabelText('Nova senha *');
        const confirmeInput = screen.getByLabelText('Confirme a senha *');

        await user.type(senhaInput, '123456');
        await user.type(confirmeInput, '654321');
        await user.tab(); 
        await user.click(screen.getByRole('button', { name: /cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/as senhas devem ser iguais/i)).toBeInTheDocument();
        }, {timeout: 3000});
    });

    test('deve cadastrar usuário com sucesso, navegar e notificar', async () => {
        const user = userEvent.setup({ delay: null });
        const triggerCadastrar = vi.fn().mockReturnValue({
            unwrap: () => Promise.resolve()
        });

        useCadastrarMock.mockReturnValue([triggerCadastrar, { isLoading: false }] as any);

        renderCadastro();

        await user.type(screen.getByPlaceholderText(/seu@email.com/i), 'novo@teste.com');
        await user.type(screen.getByLabelText('Nova senha *'), '123456');
        await user.type(screen.getByLabelText('Confirme a senha *'), '123456');
        
        await user.click(screen.getByRole('button', { name: /cadastrar/i }));

        await waitFor(() => {
            expect(triggerCadastrar).toHaveBeenCalledWith({
                email: 'novo@teste.com',
                senha: '123456'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/login');
            expect(mockDispatch).toHaveBeenCalled();
            expect(notificacaoSlice.mostrarNotificacao).toHaveBeenCalledWith(
                expect.objectContaining({ variant: 'success' })
            );
        });
    });

    test('deve tratar erro de e-mail já existente vindo da API', async () => {
        const user = userEvent.setup({ delay: null });
        const triggerCadastrar = vi.fn().mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: 'Este email já está em uso' } })
        });

        useCadastrarMock.mockReturnValue([triggerCadastrar, { isLoading: false }] as any);

        renderCadastro();

        await user.type(screen.getByPlaceholderText(/seu@email.com/i), 'duplicado@teste.com');
        await user.type(screen.getByLabelText('Nova senha *'), '123456');
        await user.type(screen.getByLabelText('Confirme a senha *'), '123456');
        await user.click(screen.getByRole('button', { name: /cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Este email já está em uso')).toBeInTheDocument();
        });
    });
});