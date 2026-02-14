import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ObraCard } from '../../../components/obra/ObraCard';
import type { Obra } from '../../../types/Obra';
import { AcoesButtonsMock, type AcoesButtonsMockProps } from '../../mocks/AcoesButtonsMock';
import { NomeInputMock, type NomeInputMockProps } from '../../mocks/NomeObraInputMock';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockDispatch = vi.fn();
vi.mock('../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

const mockDeletarObra = vi.fn();
vi.mock('../../../services/obraApi', () => ({
    useDeletarObraMutation: () => [
        mockDeletarObra,
        { isLoading: false }
    ],
}));

vi.mock('../../../components/obra/NomeObraInput', () => ({
    NomeObraInput: (props: NomeInputMockProps) => <NomeInputMock {...props} />,
}));
vi.mock('../../../components/common/AcoesButton', () => ({
    AcoesButton: (props: AcoesButtonsMockProps) => <AcoesButtonsMock {...props}/>,
}));

describe('ObraCard', () => {
    const mockObra = {
        id: 123,
        nome: 'Apartamento',
        porcentagem: 50
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderCard = (obra: Obra = mockObra) => render(
        <MemoryRouter>
            <ObraCard obra={obra} />
        </MemoryRouter>
    )

    it('deve renderizar as informações básicas da obra', () => {
        renderCard();
        expect(screen.getByText('Apartamento')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('deve alternar para o modo de edição ao clicar no nome', async () => {
        const user = userEvent.setup();
        renderCard();

        const botaoNome = screen.getByRole('button', { name: /Apartamento/i });
        await user.click(botaoNome);

        expect(screen.getByTestId('nome-input')).toBeInTheDocument();
        expect(screen.queryByText('Apartamento')).not.toBeInTheDocument();
    });

    it.each([
        [0, 'bg-(--main)'],
        [25, 'bg-(--secondary)'],
        [25, 'text-(--black)!'],
        [33, 'bg-(--blue)'],
        [55, 'bg-(--blue)'],
        [55, 'text-white'],
        [75, 'bg-(--blue)'],
        [100, 'bg-(--green)'],
        [100, 'text-(--black)!'],
    ])('deve aplicar as cores corretas baseadas na porcentagem %d', (porcentagem: number, className: string) => {
        const { container } = renderCard({ ...mockObra, porcentagem: porcentagem });
        const link = container.querySelector('a');
        
        expect(link).toHaveClass(className);
    })

    it('deve chamar a função de deletar quando acionada', async () => {
        mockDeletarObra.mockReturnValue({
            unwrap: () => Promise.resolve()
        });

        renderCard();
        const botaoDeletar = screen.getByText('Deletar');
        fireEvent.click(botaoDeletar);

        expect(mockDeletarObra).toHaveBeenCalledWith(123);
    });

    it('deve navegar para detalhes ao clicar em "Ver detalhes"', () => {
        renderCard();
        
        const botaoVer = screen.getByText('Ver detalhes');
        fireEvent.click(botaoVer);

        expect(mockNavigate).toHaveBeenCalledWith('/obra/123');
    });
});