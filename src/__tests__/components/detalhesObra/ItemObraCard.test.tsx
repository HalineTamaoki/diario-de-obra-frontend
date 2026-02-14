import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemObraCard } from '../../../components/detalhesObra/ItemObraCard';
import type { EtapasObra, ItemObra } from '../../../types/DetalhesObra';

vi.mock('../../../components/detalhesObra/ItemObraAccordionHeader', () => ({
    ItemObraAccordionHeader: vi.fn(() => <div data-testid="mock-header" />)
}));

vi.mock('../../../components/detalhesObra/ItemObraAccordionTitle', () => ({
    ItemObraAccordionTitle: vi.fn(() => <div data-testid="mock-title" />)
}));

vi.mock('../../../components/detalhesObra/ideacao/IdeacaoCard', () => ({ IdeacaoCard: () => <div data-testid="ideacao-content" /> }));
vi.mock('../../../components/detalhesObra/orcamento/OrcamentoCard', () => ({ OrcamentoCard: () => <div data-testid="orcamento-content" /> }));
vi.mock('../../../components/detalhesObra/execucao/ExecucaoCard', () => ({ ExecucaoCard: () => <div data-testid="execucao-content" /> }));
vi.mock('../../../components/detalhesObra/finalizado/FinalizadoCard', () => ({ FinalizadoCard: () => <div data-testid="finalizado-content" /> }));

describe('ItemObraCard', () => {
    const defaultProps = {
        itemObra: {
            id: 123,
            nome: 'Teste Item',
            ultimaEtapa: 'ideacao'
        } as ItemObra,
        open: true,
        toogleAccordionState: vi.fn(),
        idObra: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.each(['ideacao', 'orcamento', 'execucao', 'finalizado'])('deve renderizar quando a etapa for "%s"', (etapa: string) => {
        const props = { ...defaultProps, itemObra: { ...defaultProps.itemObra, ultimaEtapa: etapa as EtapasObra } };

        render(<ItemObraCard {...props}  />);

        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-title')).toBeInTheDocument();
        expect(screen.getByTestId(`${etapa}-content`)).toBeInTheDocument();
    });
});