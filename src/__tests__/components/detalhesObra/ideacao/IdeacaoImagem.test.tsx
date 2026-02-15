import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IdeacaoImagem } from '../../../../components/detalhesObra/ideacao/IdeacaoImagem';
import { useRemoverLinkMutation } from '../../../../services/ideacaoApi';
import { AcoesButtonsMock, type AcoesButtonsMockProps } from '../../../mocks/AcoesButtonsMock';

vi.mock('../../../../services/ideacaoApi', () => ({
    useRemoverLinkMutation: vi.fn(),
}));

vi.mock('react-responsive', () => ({
    useMediaQuery: vi.fn(),
}));

vi.mock('../../../../components/detalhesObra/ideacao/IdeacaoImg', () => ({
    IdeacaoImg: ({ url }: { url: string }) => <img data-testid="mock-img" src={url} alt="mock" />
}));

vi.mock('../../../../components/common/AcoesWithChildren', () => ({
    AcoesWithChildren: ({children, ...props}: { children: ReactNode } & AcoesButtonsMockProps) => <div>
        <AcoesButtonsMock {...props}/>
        {children}
    </div>
}));

const mockDispatch = vi.fn();
vi.mock('../../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const useRemoverLinkMutationMock = vi.mocked(useRemoverLinkMutation);
const useMediaQueryMock = vi.mocked(useMediaQuery);

const mockIdeia = {
    id: 1,
    link: 'https://exemplo.com/imagem.jpg',
    itemidObra: 10,
};

describe('IdeacaoImagem', () => {
    const idObra = 100;

    beforeEach(() => {
        vi.clearAllMocks();
        useMediaQueryMock.mockReturnValue(false); 
        useRemoverLinkMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        vi.stubGlobal('open', vi.fn());
    });

    it('deve renderizar a imagem corretamente através do componente IdeacaoImg', () => {
        render(<IdeacaoImagem ideia={mockIdeia} idObra={idObra} />);
        
        const img = screen.getByTestId('mock-img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', mockIdeia.link);
    });

    it('deve abrir o link da imagem em nova aba ao clicar no botão de ver imagem (Desktop)', () => {
        render(<IdeacaoImagem ideia={mockIdeia} idObra={idObra} />);
        
        const btnVer = screen.getByRole('button', { name: /mock/i }); 
        fireEvent.click(btnVer);

        expect(window.open).toHaveBeenCalledWith(mockIdeia.link, '_blank');
    });

    it('deve chamar removerLink ao clicar no botão de deletar (Desktop)', async () => {
        const removerSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useRemoverLinkMutationMock.mockReturnValue([removerSpy, { isLoading: false }] as any);

        render(<IdeacaoImagem ideia={mockIdeia} idObra={idObra} />);

        const btnDeletar = screen.getByRole('button', { name: /deletar/i });
        fireEvent.click(btnDeletar);

        expect(removerSpy).toHaveBeenCalledWith({
            id: mockIdeia.id,
            idItem: mockIdeia.itemidObra,
            idObra: idObra
        });
    });

    it('deve utilizar AcoesWithChildren quando estiver em modo Mobile', () => {
        useMediaQueryMock.mockReturnValue(true);
        
        render(<IdeacaoImagem ideia={mockIdeia} idObra={idObra} />);
        expect(screen.getByTestId('mock-img')).toBeInTheDocument();
    });

    it('deve desativar os botões enquanto a mutação está em loading', () => {
        useRemoverLinkMutationMock.mockReturnValue([vi.fn(), { isLoading: true }] as any);

        render(<IdeacaoImagem ideia={mockIdeia} idObra={idObra} />);

        const btnDeletar = screen.getByRole('button', { name: /deletar/i });
        expect(btnDeletar).toBeDisabled();
    });
});