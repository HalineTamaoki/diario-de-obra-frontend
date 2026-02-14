import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrcamentoDetalhes } from '../../../../components/detalhesObra/orcamento/OrcamentoDetalhes';
import {
    useDeletarOrcamentoMutation,
    useEditarOrcamentoMutation,
    useObterOrcamentoDetalhesQuery,
    useSelecionarOrcamentoMutation
} from '../../../../services/orcamentoApi';

vi.mock('../../../../services/orcamentoApi', () => ({
    useObterOrcamentoDetalhesQuery: vi.fn(),
    useEditarOrcamentoMutation: vi.fn(() => [vi.fn(), {isLoading: false}]),
    useDeletarOrcamentoMutation: vi.fn(),
    useSelecionarOrcamentoMutation: vi.fn(),
}));

vi.mock('../../../../components/detalhesObra/orcamento/OrcamentoForm', () => ({
    OrcamentoForm: ({ onSubmit, onCancel }: any) => (
        <div>
            <button onClick={() => onSubmit({ empresa: 'Editado' })} data-testid="mock-form">
                Salvar no Form
            </button>
            <button onClick={() => onCancel()} data-testid="mock-form-cancel">
                Cancelar
            </button>
        </div>
    )
}));

const mockDispatch = vi.fn();
vi.mock('../../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const useObterMock = vi.mocked(useObterOrcamentoDetalhesQuery);
const useEditarMock = vi.mocked(useEditarOrcamentoMutation);
const useDeletarMock = vi.mocked(useDeletarOrcamentoMutation);
const useSelecionarMock = vi.mocked(useSelecionarOrcamentoMutation);

const renderWithProviders = () => {
    return render(
        <MemoryRouter initialEntries={['/obra/1/orcamento/10/50']}>
            <Routes>
                <Route path="/obra/:idObra/orcamento/:idItem/:idOrcamento" element={<OrcamentoDetalhes />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('OrcamentoDetalhes', () => {
    const mockOrcamento = {
        id: 50,
        empresa: 'Fornecedor XYZ',
        valor: 2500,
        data: '2023-10-27',
        comentarios: 'Obs teste',
        selecionado: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useEditarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        useDeletarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        useSelecionarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
    });

    it('deve renderizar os detalhes do orçamento corretamente', () => {
        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);
        renderWithProviders();

        expect(screen.getByText('Fornecedor XYZ')).toBeInTheDocument();
        expect(screen.getByText(/2\.500,00/)).toBeInTheDocument();
        expect(screen.getByText('Obs teste')).toBeInTheDocument();
    });

    it('deve alternar para o modo de edição ao clicar no botão Editar', () => {
        const editarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useEditarMock.mockReturnValue([editarSpy, { isLoading: false }] as any);

        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);
        renderWithProviders();

        fireEvent.click(screen.getByText(mockOrcamento.comentarios));  
        const btnEditar = screen.getByText('Salvar no Form');
        fireEvent.click(btnEditar);

        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    });
    
    it('deve sair do modo de edição', async () => {
        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);
        renderWithProviders();

        const comentarios = screen.getByText(mockOrcamento.comentarios);
        fireEvent.click(comentarios);
        expect(comentarios).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Cancelar'));
        expect(screen.getByText(mockOrcamento.comentarios)).toBeInTheDocument();
    });

    it('deve chamar a mutação de seleção ao clicar no botão selecionar', async () => {
        const selecionarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useSelecionarMock.mockReturnValue([selecionarSpy, { isLoading: false }] as any);
        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);

        renderWithProviders();

        const btn = screen.getByText('Marcar como selecionado');
        fireEvent.click(btn);

        expect(selecionarSpy).toHaveBeenCalledWith(expect.objectContaining({
            id: 50,
            selecionado: true
        }));
    });

    it('deve chamar a mutação de deletar e navegar de volta após sucesso', async () => {
        const deletarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useDeletarMock.mockReturnValue([deletarSpy, { isLoading: false }] as any);
        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);

        renderWithProviders();

        const btnDeletar = screen.getByText('Deletar');
        fireEvent.click(btnDeletar);

        expect(deletarSpy).toHaveBeenCalledWith({ id: 50, idItem: 10, idObra: 1 });
    });

    it('deve mostrar LoadingContainer enquanto os dados são carregados', () => {
        useObterMock.mockReturnValue({ data: undefined, isLoading: true } as any);
        renderWithProviders();
        
        expect(screen.queryByText('Fornecedor XYZ')).not.toBeInTheDocument();
    });

    it('deve tratar erro na edição disparando notificação', async () => {
        const editarSpy = vi.fn().mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: 'Erro ao editar' } })
        });
        useEditarMock.mockReturnValue([editarSpy, { isLoading: false }] as any);
        useObterMock.mockReturnValue({ data: mockOrcamento, isLoading: false } as any);

        renderWithProviders();

        fireEvent.click(screen.getByText(mockOrcamento.comentarios));
        fireEvent.click(screen.getByText('Salvar no Form'));

        await waitFor(() => {
            expect(editarSpy).toHaveBeenCalled();
        });
    });
});