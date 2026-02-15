import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DetalhesObra } from '../../pages/DetalhesObra';
import { useCadastrarItemMutation } from '../../services/itemObraApi';
import { useObterObraDetalhadaQuery } from '../../services/obraApi';
import { type AddInputMockProps, AddInputMock } from '../mocks/AddInputMock';

const mockDispatch = vi.fn();
vi.mock('../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

vi.mock('../../services/obraApi', () => ({
    useObterObraDetalhadaQuery: vi.fn(() => ({
        data: undefined,
        isLoading: false
    })),
}));

vi.mock('../../services/itemObraApi', () => ({
    useCadastrarItemMutation: vi.fn(() => [vi.fn(), {isLoading: false}]),
}));

vi.mock('../../components/detalhesObra/ItemObraCard', () => ({
    ItemObraCard: ({ itemObra, open }: any) => (
        <div data-testid={`card-${itemObra.id}`}>
            {itemObra.nome} {open ? '(Aberto)' : '(Fechado)'}
        </div>
    ),
}));

vi.mock('../../components/common/AddInput', () => ({
    AddInput: (props: AddInputMockProps) => <AddInputMock {...props}/>,    
}));

const useObterObraDetalhadaMock = vi.mocked(useObterObraDetalhadaQuery);
const useCadastrarItemMutationMock = vi.mocked(useCadastrarItemMutation);

const customRender = (initialEntries = ['/obra/1']) => render(
    <MemoryRouter initialEntries={initialEntries}>
        <Routes>
            <Route path="/obra/:idObra" element={<DetalhesObra />} />
            <Route path="/" element={<div>Página Inicial</div>} />
        </Routes>
    </MemoryRouter>
);

describe('DetalhesObra', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    it('deve redirecionar para a home se o ID da obra for inválido', async () => {
        customRender(['/obra/abc']);
        
        await waitFor(() => {
            expect(screen.getByText('Página Inicial')).toBeInTheDocument();
        });
    });

    it('deve carregar e exibir o nome da obra e seus itens', () => {
        useObterObraDetalhadaMock.mockReturnValue({
            data: { nome: 'Reforma A', items: [{ id: 10, nome: 'Pintura' }] },
            isLoading: false,
        } as any);
        useCadastrarItemMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        customRender();

        expect(screen.getByText('Reforma A')).toBeInTheDocument();
        expect(screen.getByTestId('card-10')).toBeInTheDocument();
    });

    it('deve abrir o primeiro item automaticamente se nenhum estiver aberto', () => {
        useObterObraDetalhadaMock.mockReturnValue({
            data: { nome: 'Obra', items: [{ id: 1, nome: 'Item 1' }, { id: 2, nome: 'Item 2' }] },
            isLoading: false,
        } as any);
        useCadastrarItemMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        customRender();

        expect(screen.getByText(/Item 1 \(Aberto\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Item 2 \(Fechado\)/i)).toBeInTheDocument();
    });

    it('deve salvar e recuperar o estado do accordion no localStorage', async () => {
        localStorage.setItem('accordion_state', JSON.stringify([2]));

        useObterObraDetalhadaMock.mockReturnValue({
            data: { nome: 'Obra', items: [{ id: 1, nome: 'I1' }, { id: 2, nome: 'I2' }] },
            isLoading: false,
        } as any);
        useCadastrarItemMutationMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);

        customRender();

        expect(screen.getByText(/I2 \(Aberto\)/i)).toBeInTheDocument();
    });

    it('deve chamar a mutação de cadastro ao adicionar novo item', async () => {
        const cadastrarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useObterObraDetalhadaMock.mockReturnValue({ data: { items: [] }, isLoading: false } as any);
        useCadastrarItemMutationMock.mockReturnValue([cadastrarSpy, { isLoading: false }] as any);

        customRender(['/obra/5']);

        const input = screen.getByPlaceholderText(/Adicionar novo item/i);
        fireEvent.change(input, { target: { value: 'Novo Item Teste' } });

        expect(cadastrarSpy).toHaveBeenCalledWith({ idObra: 5, nome: 'Novo Item Teste' });
    });
});