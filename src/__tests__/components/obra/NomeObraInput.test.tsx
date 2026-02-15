import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NomeObraInput } from '../../../components/obra/NomeObraInput';
import { mostrarNotificacao } from '../../../features/notificacaoSlice';

const mockDispatch = vi.fn();
vi.mock('../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

const mockEditarObra = vi.fn();
vi.mock('../../../services/obraApi', () => ({
    useEditarObraMutation: () => [
        mockEditarObra,
        { isLoading: false }
    ],
}));

vi.mock('../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

describe('NomeObraInput com Dispatch Mockado', () => {
    const mockObra = { id: 123, nome: 'Obra Teste', porcentagem: 40 };
    const mockSairModoEdicao = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve chamar editarObra com os dados corretos ao submeter', async () => {
        const user = userEvent.setup();
        mockEditarObra.mockReturnValue({
            unwrap: () => Promise.resolve(),
        });

        render(<NomeObraInput obra={mockObra} sairModoEdicao={mockSairModoEdicao} />);

        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Novo Nome{enter}');

        expect(mockEditarObra).toHaveBeenCalledWith({
            id: 123,
            nome: 'Novo Nome',
        });
    });

    it('deve disparar a notificação de erro quando a mutation falha', async () => {
        const user = userEvent.setup();
        const mensagemErro = 'Falha na conexão';
        
        mockEditarObra.mockReturnValue({
            unwrap: () => Promise.reject({ data: { mensagem: mensagemErro } }),
        });

        render(<NomeObraInput obra={mockObra as any} sairModoEdicao={mockSairModoEdicao} />);

        const input = screen.getByRole('textbox');
        await user.clear(input);
        await user.type(input, 'Erro Teste{enter}');

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalled();
            expect(mostrarNotificacao).toHaveBeenCalledWith({
                mensagem: mensagemErro,
                variant: 'danger',
            });
        });
    });

    it('deve usar a mensagem padrão caso o erro não venha do servidor', async () => {
        const user = userEvent.setup();
        
        mockEditarObra.mockReturnValue({
            unwrap: () => Promise.reject({}),
        });

        render(<NomeObraInput obra={mockObra as any} sairModoEdicao={mockSairModoEdicao} />);

        const input = screen.getByRole('textbox');
        await user.type(input, 'Nome{enter}');

        await waitFor(() => {
            expect(mostrarNotificacao).toHaveBeenCalledWith({
                mensagem: 'Erro ao editar nome da obra.',
                variant: 'danger',
            });
        });
    });
});