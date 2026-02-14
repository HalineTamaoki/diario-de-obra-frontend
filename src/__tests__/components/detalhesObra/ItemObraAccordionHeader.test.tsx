import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ItemObraAccordionHeader } from '../../../components/detalhesObra/ItemObraAccordionHeader';
import { useDeletarItemMutation, useEditarItemMutation } from '../../../services/itemObraApi';
import type { EtapasObra } from '../../../types/DetalhesObra';
import { AcoesButtonsMock, type AcoesButtonsMockProps } from '../../mocks/AcoesButtonsMock';
import { NomeInputMock, type NomeInputMockProps } from '../../mocks/NomeObraInputMock';

const useDeletarItemMutationMock = vi.mocked(useDeletarItemMutation);
const useEditarItemMutationMock = vi.mocked(useEditarItemMutation);

const mockItem = {
    id: 1,
    nome: 'Pintura',
    ultimaEtapa: 'ideacao' as EtapasObra,
};

vi.mock('../../../services/itemObraApi', () => ({
    useDeletarItemMutation: vi.fn(),
    useEditarItemMutation: vi.fn(),
}));

vi.mock('../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const mockDispatch = vi.fn();
vi.mock('../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../components/common/AcoesButton', () => ({
    AcoesButton: (props: AcoesButtonsMockProps) => <AcoesButtonsMock {...props}/>,
}));

vi.mock('../../../components/common/NomeInput', () => ({
    NomeInput: (props: NomeInputMockProps) => <NomeInputMock {...props} />,
}));

describe('ItemObraAccordionHeader', () => {
    const toggleActiveSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useDeletarItemMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        useEditarItemMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
    });

    it.each([
        ['ideacao', 'bg-(--main)'],
        ['orcamento', 'bg-(--secondary)'],
        ['execucao', 'bg-(--blue)'],
        ['finalizacao', 'bg-(--green)'],
    ])('deve renderizar o nome do item e aplicar a cor correta baseada para etapa %s', (etapa: string, className: string) => {
        render(
            <ItemObraAccordionHeader 
                itemObra={{...mockItem, ultimaEtapa: etapa as EtapasObra}} 
                active={false} 
                toogleActive={toggleActiveSpy} 
                idObra={123} 
            />
        );

        expect(screen.getByText('Pintura')).toBeInTheDocument();
        const container = screen.getByText('Pintura').closest('div');
        expect(container).toHaveClass(className);
    });

    it('deve entrar no modo de edição ao clicar no nome', () => {
        render(
            <ItemObraAccordionHeader 
                itemObra={mockItem} 
                active={false} 
                toogleActive={toggleActiveSpy} 
                idObra={123} 
            />
        );

        const btnNome = screen.getByRole('button', { name: /Pintura/i });
        fireEvent.click(btnNome);
        expect(screen.getByTestId('nome-input')).toBeInTheDocument();
    });

    it('deve chamar a função de deletar quando a ação for disparada', async () => {
        const deletarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useDeletarItemMutationMock.mockReturnValue([deletarSpy, { isLoading: false }] as any);

        render(
            <ItemObraAccordionHeader 
                itemObra={mockItem} 
                active={false} 
                toogleActive={toggleActiveSpy} 
                idObra={123} 
            />
        );

        const btnDeletar = screen.getByText('Deletar');
        fireEvent.click(btnDeletar);

        expect(deletarSpy).toHaveBeenCalledWith({ id: mockItem.id, idObra: 123 });
    });

    it('deve alternar o estado do accordion ao clicar no container principal', () => {
        const { container } = render(
            <ItemObraAccordionHeader 
                itemObra={mockItem} 
                active={false} 
                toogleActive={toggleActiveSpy} 
                idObra={123} 
            />
        );

        const wrapper = container.firstChild as HTMLElement;
        fireEvent.click(wrapper);

        expect(toggleActiveSpy).toHaveBeenCalledTimes(1);
    });
});