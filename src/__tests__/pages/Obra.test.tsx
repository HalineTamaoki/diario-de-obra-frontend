import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Obra } from '../../pages/Obra';
import { useCadastrarObraMutation, useObterObrasQuery } from '../../services/obraApi';
import type { Obra as ObraType } from '../../types/Obra';
import { AddInputMock, type AddInputMockProps } from '../mocks/AddInputMock';

vi.mock('../../services/obraApi', () => ({
    useObterObrasQuery: vi.fn(),
    useCadastrarObraMutation: vi.fn(),
    obraApi: { reducerPath: 'obraApi', reducer: (state = {}) => state, middleware: () => (next: any) => (action: any) => next(action) }
}));

vi.mock('../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

const mockDispatch = vi.fn();
vi.mock('../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../components/common/AddInput', () => ({
    AddInput: (props: AddInputMockProps) => <AddInputMock {...props}/>,    
}));

vi.mock('../../components/obra/ObraCard', () => ({
    ObraCard: ({obra}: {obra: ObraType}) => 
        <div id={obra.id.toString()}>{obra.nome}</div>,    
}));

const useObterObrasQueryMock = vi.mocked(useObterObrasQuery);
const useCadastrarObraMutationMock = vi.mocked(useCadastrarObraMutation);

describe('Componente Obra', () => {
  
    it('deve exibir a mensagem de lista vazia quando não houver obras', () => {
        useObterObrasQueryMock.mockReturnValue({
            data: [],
            isLoading: false,
            refetch: vi.fn()
        });
        useCadastrarObraMutationMock.mockReturnValue([vi.fn(), { isLoading: false, reset: vi.fn() }]);

        render(<Obra />);
        
        expect(screen.getByText(/Nenhuma obra adicionada/i)).toBeInTheDocument();
    });

    it('deve renderizar a lista de obras corretamente', () => {
        const mockObras = [
            { id: '1', nome: 'Reforma Cozinha' },
            { id: '2', nome: 'Instalação Pisos' },
        ];

        useObterObrasQueryMock.mockReturnValue({
            data: mockObras,
            isLoading: false,
            refetch: vi.fn()
        });

        useCadastrarObraMutationMock.mockReturnValue([vi.fn(), { isLoading: false, reset: vi.fn() }]);

        render(<Obra />);

        expect(screen.getByText('Reforma Cozinha')).toBeInTheDocument();
        expect(screen.getByText('Instalação Pisos')).toBeInTheDocument();
    });

    it('deve chamar a mutação de cadastro ao adicionar uma nova obra', async () => {
        const cadastrarMock = vi.fn().mockReturnValue({
        unwrap: () => Promise.resolve(),
        });

        useObterObrasQueryMock.mockReturnValue({
            data: [],
            isLoading: false,
            refetch: vi.fn()
        });
        useCadastrarObraMutationMock.mockReturnValue([cadastrarMock, { isLoading: false, reset: vi.fn() }]);

        render(<Obra />);

        const input = screen.getByPlaceholderText(/Adicionar nova obra/i);
        fireEvent.change(input, { target: { value: 'Nova Obra Teste' } });
        
        await waitFor(() => {
            expect(cadastrarMock).toHaveBeenCalledWith({ nome: 'Nova Obra Teste' });
        });
    });

    it('deve exibir o estado de loading enquanto carrega as obras', () => {
        const mockObras = [
            { id: '1', nome: 'Reforma Cozinha' },
        ];
        useObterObrasQueryMock.mockReturnValue({
            data: mockObras,
            isLoading: true,
            refetch: vi.fn()
        });
        useCadastrarObraMutationMock.mockReturnValue([vi.fn(), { isLoading: false, reset: vi.fn() }]);

        render(<Obra />);
        
        expect(screen.queryByText('Reforma Cozinha')).toBeNull(); 
    });
});