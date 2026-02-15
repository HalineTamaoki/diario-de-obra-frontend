import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemObraAccordionTitle } from '../../../components/detalhesObra/ItemObraAccordionTitle';
import { useEtapasItem } from '../../../hooks/useEtapasItem';
import type { EtapasObra } from '../../../types/DetalhesObra';

vi.mock('../../../hooks/useEtapasItem', () => ({
    useEtapasItem: vi.fn()
}));

const useEtapasItemMock = vi.mocked(useEtapasItem);

describe('ItemObraAccordionTitle', () => {
    const idItem = 10;
    const idObra = 1;
    const avancarEtapaSpy = vi.fn();
    const voltarEtapaSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useEtapasItemMock.mockReturnValue({
            avancarEtapa: avancarEtapaSpy,
            voltarEtapa: voltarEtapaSpy,
        } as any);
    });

    it.each([
        ['ideacao', 'Ideias para a obra', 1],
        ['orcamento', 'Orçamentos', 2],
        ['execucao', 'Execução', 2],
        ['finalizado', 'Finalizado', 1],
    ])('deve renderizar o título correto para a etapa de %s, mostrar o título %s e %d botões', (etapa: string, nome: string, numeroBotoes: number) => {
        render(<ItemObraAccordionTitle ultimaEtapa={etapa as EtapasObra} idObra={idObra} idItem={idItem} />);

        expect(screen.getByText(nome)).toBeInTheDocument();
        expect(screen.queryAllByRole('button').length).toBe(numeroBotoes);
    });

    it('deve chamar voltarEtapa com o id do item correto ao clicar no botão voltar', () => {
        render(<ItemObraAccordionTitle ultimaEtapa="execucao" idObra={idObra} idItem={idItem} />);

        const btnVoltar = screen.queryAllByRole('button')[0];
        fireEvent.click(btnVoltar);

        expect(voltarEtapaSpy).toHaveBeenCalledWith(idItem);
    });

    it('deve chamar avancarEtapa com o id do item correto ao clicar no botão avançar', () => {
        render(<ItemObraAccordionTitle ultimaEtapa="orcamento" idObra={idObra} idItem={idItem} />);

        const btnAvancar = screen.queryAllByRole('button')[1];
        fireEvent.click(btnAvancar);

        expect(avancarEtapaSpy).toHaveBeenCalledWith(idItem);
    });
});