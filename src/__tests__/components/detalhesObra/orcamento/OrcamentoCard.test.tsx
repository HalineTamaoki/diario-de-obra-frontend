import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrcamentoCard } from '../../../../components/detalhesObra/orcamento/OrcamentoCard';
import { useObterTodosOrcamentosQuery } from '../../../../services/orcamentoApi';

vi.mock('../../../../services/orcamentoApi', () => ({
    useObterTodosOrcamentosQuery: vi.fn(),
}));

vi.mock('../../../../components/detalhesObra/orcamento/OrcamentoResumoCard', () => ({
    OrcamentoResumoCard: ({ orcamento }: any) => (
        <div data-testid="mock-orcamento-resumo">{orcamento.empresa}</div>
    ),
}));

const mockDispatch = vi.fn();
vi.mock('../../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const useObterTodosOrcamentosMock = vi.mocked(useObterTodosOrcamentosQuery);

const customRender = (ui: React.ReactElement) => render(
    <MemoryRouter>
        {ui}
    </MemoryRouter>
);

describe('OrcamentoCard', () => {
    const props = { idItem: 10, idObra: 1 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve exibir mensagem quando não houver orçamentos', () => {
        useObterTodosOrcamentosMock.mockReturnValue({ data: [], isLoading: false } as any);

        customRender(<OrcamentoCard {...props} />);

        expect(screen.getByText(/Nenhum orçamento adicionado/i)).toBeInTheDocument();
        expect(screen.queryByText(/Média:/i)).not.toBeInTheDocument();
    });

    it('deve calcular e exibir a média corretamente', () => {
        const mockOrcamentos = [
            { id: 1, empresa: 'A', valor: 100 },
            { id: 2, empresa: 'B', valor: 200 },
            { id: 3, empresa: 'C', valor: 300 },
        ];
        useObterTodosOrcamentosMock.mockReturnValue({ data: mockOrcamentos, isLoading: false } as any);

        customRender(<OrcamentoCard {...props} />);

        expect(screen.getByText(/Média:/i)).toHaveTextContent('200,00');
    });

    it('deve renderizar a lista de OrcamentoResumoCard', () => {
        const mockOrcamentos = [
            { id: 1, empresa: 'Empresa 1', valor: 50 },
            { id: 2, empresa: 'Empresa 2', valor: 150 },
        ];
        useObterTodosOrcamentosMock.mockReturnValue({ data: mockOrcamentos, isLoading: false } as any);

        customRender(<OrcamentoCard {...props} />);

        const cards = screen.getAllByTestId('mock-orcamento-resumo');
        expect(cards).toHaveLength(2);
        expect(screen.getByText('Empresa 1')).toBeInTheDocument();
        expect(screen.getByText('Empresa 2')).toBeInTheDocument();
    });

    it('deve conter o link correto para adicionar novo orçamento', () => {
        useObterTodosOrcamentosMock.mockReturnValue({ data: [], isLoading: false } as any);

        customRender(<OrcamentoCard {...props} />);

        const link = screen.getByRole('link', { name: /Adicionar novo/i });
        expect(link).toHaveAttribute('href', `/obra/${props.idObra}/orcamento/${props.idItem}/novo`);
    });

    it('deve exibir o LoadingContainer durante o carregamento', () => {
        useObterTodosOrcamentosMock.mockReturnValue({ data: undefined, isLoading: true } as any);

        customRender(<OrcamentoCard {...props} />);
        
        expect(screen.queryByText(/Nenhum orçamento adicionado/i)).not.toBeInTheDocument();
    });
});