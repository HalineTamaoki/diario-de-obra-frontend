import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Login } from '../../pages/Login';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

const mockLogin = vi.fn();
vi.mock('../../services/authApi', () => ({
    useLoginMutation: () => [
        mockLogin,
        { isLoading: false }
    ],
}));

vi.mock('../../components/layout/LayoutNaoLogado', () => ({
    LayoutNaoLogado: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

describe('Página de Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderLogin = () => render(<Login />, { wrapper: BrowserRouter });

    test('deve exibir erros de validação quando os campos estiverem vazios', async () => {
        const user = userEvent.setup();
        renderLogin();

        const submitButton = screen.getByRole('button', { name: /entrar/i });
        await user.click(submitButton);

        expect(await screen.findAllByText(/campo obrigatório/i)).toHaveLength(2);
    });

    test('deve realizar login com sucesso e navegar para a home', async () => {
        const user = userEvent.setup();
        
        mockLogin.mockReturnValue({
            unwrap: () => Promise.resolve({ user: { id: 1, nome: 'Teste' } })
        });

        renderLogin();

        await user.type(screen.getByPlaceholderText(/seu@email.com/i), 'valido@email.com');
        await user.type(screen.getByPlaceholderText('••••••••'), '123456');
        
        await user.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: 'valido@email.com',
                senha: '123456'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('deve exibir mensagem de erro vinda da API em caso de falha', async () => {
        const user = userEvent.setup();
        
        mockLogin.mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: 'Credenciais inválidas' } })
        });

        renderLogin();

        await user.type(screen.getByPlaceholderText(/seu@email.com/i), 'errado@email.com');
        await user.type(screen.getByPlaceholderText('••••••••'), '123456');
        
        await user.click(screen.getByRole('button', { name: /entrar/i }));

        await waitFor(() => {
            expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
        });
    });
});