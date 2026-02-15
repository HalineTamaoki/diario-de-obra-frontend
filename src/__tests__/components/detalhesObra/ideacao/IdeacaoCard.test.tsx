import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAddLinkMutation, useObterIdeiasByItemQuery } from '../../../../services/ideacaoApi';
import { IdeacaoCard } from '../../../../components/detalhesObra/ideacao/IdeacaoCard';

vi.mock('../../../../services/ideacaoApi', () => ({
    useObterIdeiasByItemQuery: vi.fn(),
    useAddLinkMutation: vi.fn(),
}));

vi.mock('../../../../components/detalhesObra/ideacao/IdeacaoImagem', () => ({
    IdeacaoImagem: ({ ideia }: any) => <div data-testid="mock-ideia-img">{ideia.link}</div>
}));

const mockDispatch = vi.fn();
vi.mock('../../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const useObterIdeiasMock = vi.mocked(useObterIdeiasByItemQuery);
const useAddLinkMutationMock = vi.mocked(useAddLinkMutation);

describe('IdeacaoCard', () => {
    const props = { idItem: 10, idObra: 1 };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve exibir a mensagem de lista vazia quando não existirem ideias', () => {
        useObterIdeiasMock.mockReturnValue({ data: [], isLoading: false } as any);
        useAddLinkMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        render(<IdeacaoCard {...props} />);

        expect(screen.getByText(/Nenhum link adicionado/i)).toBeInTheDocument();
    });

    it('deve renderizar a lista de ideias corretamente', () => {
        const mockIdeias = [
            { id: 1, link: 'http://link1.com' },
            { id: 2, link: 'http://link2.com' }
        ];

        useObterIdeiasMock.mockReturnValue({ data: mockIdeias, isLoading: false } as any);
        useAddLinkMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        render(<IdeacaoCard {...props} />);

        const itens = screen.getAllByTestId('mock-ideia-img');
        expect(itens).toHaveLength(2);
        expect(screen.getByText('http://link1.com')).toBeInTheDocument();
    });

    it('deve chamar a mutação de adicionar link ao submeter o input', async () => {
        const addLinkSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        
        useObterIdeiasMock.mockReturnValue({ data: [], isLoading: false } as any);
        useAddLinkMutationMock.mockReturnValue([addLinkSpy, { isLoading: false }] as any);

        render(<IdeacaoCard {...props} />);

        const input = screen.getByPlaceholderText(/Insira o link com a ideia/i);
        fireEvent.change(input, { target: { value: 'https://nova-ideia.com' } });
        
        const btnAdd = screen.getByRole('button'); 
        fireEvent.click(btnAdd);

        expect(addLinkSpy).toHaveBeenCalledWith({
            idObra: props.idObra,
            itemidObra: props.idItem,
            link: 'https://nova-ideia.com'
        });
    });

    it('deve exibir o estado de loading do LoadingContainer', () => {
        useObterIdeiasMock.mockReturnValue({ data: undefined, isLoading: true } as any);
        useAddLinkMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        render(<IdeacaoCard {...props} />);
        
        expect(screen.queryByText(/Nenhum link adicionado/i)).not.toBeInTheDocument();
    });
});