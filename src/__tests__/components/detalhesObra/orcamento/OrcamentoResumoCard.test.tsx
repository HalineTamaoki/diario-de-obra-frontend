import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrcamentoResumoCard } from '../../../../components/detalhesObra/orcamento/OrcamentoResumoCard';
import { useDeletarOrcamentoMutation, useSelecionarOrcamentoMutation } from '../../../../services/orcamentoApi';
import { AcoesButtonsMock, type AcoesButtonsMockProps } from '../../../mocks/AcoesButtonsMock';

vi.mock('../../../../services/orcamentoApi', () => ({
    useSelecionarOrcamentoMutation: vi.fn(),
    useDeletarOrcamentoMutation: vi.fn(),
}));

vi.mock('../../../../components/common/AcoesButton', () => ({
    AcoesButton: (props: AcoesButtonsMockProps) => <AcoesButtonsMock {...props}/>,
}));

const mockDispatch = vi.fn();
vi.mock('../../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const useSelecionarMock = vi.mocked(useSelecionarOrcamentoMutation);
const useDeletarMock = vi.mocked(useDeletarOrcamentoMutation);

const customRender = (ui: React.ReactElement) => {
    return render(
        <MemoryRouter>
            {ui}
        </MemoryRouter>
    );
};

describe('OrcamentoResumoCard', () => {
    const mockOrcamento = {
        id: 50,
        empresa: 'Fornecedor ABC',
        valor: 1500.50,
        selecionado: false,
    };

    const props = {
        orcamento: mockOrcamento,
        idItem: 10,
        idObra: 1,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useSelecionarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        useDeletarMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
    });

    it('deve exibir o nome da empresa e o valor formatado corretamente', () => {
        customRender(<OrcamentoResumoCard {...props} />);
        
        expect(screen.getByText('Fornecedor ABC')).toBeInTheDocument();
        expect(screen.getByText(/1\.500,50/)).toBeInTheDocument();
    });

    it('deve aplicar a classe de fundo quando o orçamento estiver selecionado', () => {
        const orcamentoSelecionado = { ...mockOrcamento, selecionado: true };
        const { container } = customRender(<OrcamentoResumoCard {...props} orcamento={orcamentoSelecionado} />);
        
        const wrapper = container.querySelector(`#orcamento-${mockOrcamento.id}-wrapper`);
        expect(wrapper).toHaveClass('bg-(--secondary)');
    });

    it('deve chamar selecionarOrcamento com o estado invertido ao clicar em selecionar', async () => {
        const selecionarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useSelecionarMock.mockReturnValue([selecionarSpy, { isLoading: false }] as any);

        customRender(<OrcamentoResumoCard {...props} />);

        const btnSelecionar = screen.getByText('Marcar como selecionado');
        fireEvent.click(btnSelecionar);

        expect(selecionarSpy).toHaveBeenCalledWith({
            id: mockOrcamento.id,
            idItem: 10,
            idObra: 1,
            selecionado: true
        });
    });

    it('deve chamar desselecionarOrcamento com o estado invertido ao clicar em desselecionar', async () => {
        const selecionarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useSelecionarMock.mockReturnValue([selecionarSpy, { isLoading: false }] as any);

        const customProps = {...props, orcamento: {...mockOrcamento, selecionado: true}}
        customRender(<OrcamentoResumoCard {...customProps} />);

        const btnDesselecionar = screen.getByText('Desselecionar');
        fireEvent.click(btnDesselecionar);

        expect(selecionarSpy).toHaveBeenCalledWith({
            id: mockOrcamento.id,
            idItem: 10,
            idObra: 1,
            selecionado: false
        });
    });

    it('deve chamar deletarOrcamento ao clicar no botão de deletar', async () => {
        const deletarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useDeletarMock.mockReturnValue([deletarSpy, { isLoading: false }] as any);

        customRender(<OrcamentoResumoCard {...props} />);

        const btnDeletar = screen.getByText('Deletar');
        fireEvent.click(btnDeletar);

        expect(deletarSpy).toHaveBeenCalledWith({
            id: mockOrcamento.id,
            idItem: 10,
            idObra: 1
        });
    });
});