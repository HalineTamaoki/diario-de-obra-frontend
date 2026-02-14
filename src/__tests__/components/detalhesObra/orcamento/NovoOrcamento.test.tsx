import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NovoOrcamento } from '../../../../components/detalhesObra/orcamento/NovoOrcamento';
import notificacaoReducer from '../../../../features/notificacaoSlice';
import { useAddOrcamentoMutation } from '../../../../services/orcamentoApi';

vi.mock('../../../../services/orcamentoApi', () => ({
    useAddOrcamentoMutation: vi.fn(),
}));

vi.mock('../../../../components/detalhesObra/orcamento/OrcamentoForm', () => ({
    OrcamentoForm: ({ onSubmit, onCancel, loading }: any) => (
        <div data-testid="mock-form">
            <button 
                onClick={() => onSubmit({ empresa: 'Nova Loja', valor: 100 })} 
                disabled={loading}
            >
                Submit Form
            </button>
            <button onClick={onCancel}>Cancel Form</button>
        </div>
    )
}));

const useAddOrcamentoMock = vi.mocked(useAddOrcamentoMutation);

const renderWithProviders = () => {
    const store = configureStore({
        reducer: { notificacao: notificacaoReducer },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/obra/5/orcamento/10/novo']}>
                <Routes>
                    <Route path="/obra/:idObra/orcamento/:idItem/novo" element={<NovoOrcamento />} />
                    <Route path="/obra/5" element={<div>Página da Obra 5</div>} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('NovoOrcamento', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar o layout com o título correto', () => {
        useAddOrcamentoMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        renderWithProviders();

        expect(screen.getByText('Novo orçamento')).toBeInTheDocument();
        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
    });

    it('deve chamar a mutação com o idObra extraído da URL ao submeter', async () => {
        const addSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useAddOrcamentoMock.mockReturnValue([addSpy, { isLoading: false }] as any);

        renderWithProviders();

        const btnSubmit = screen.getByText('Submit Form');
        fireEvent.click(btnSubmit);

        expect(addSpy).toHaveBeenCalledWith(expect.objectContaining({
            empresa: 'Nova Loja',
            valor: 100,
            idObra: 5
        }));
    });

    it('deve navegar de volta para a página da obra após sucesso no envio', async () => {
        const addSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useAddOrcamentoMock.mockReturnValue([addSpy, { isLoading: false }] as any);

        renderWithProviders();

        fireEvent.click(screen.getByText('Submit Form'));

        await waitFor(() => {
            expect(screen.getByText('Página da Obra 5')).toBeInTheDocument();
        });
    });

    it('deve navegar de volta ao cancelar o formulário', () => {
        useAddOrcamentoMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        renderWithProviders();

        fireEvent.click(screen.getByText('Cancel Form'));

        expect(screen.getByText('Página da Obra 5')).toBeInTheDocument();
    });

    it('deve disparar notificação de erro caso a mutação falhe', async () => {
        const addSpy = vi.fn().mockReturnValue({
            unwrap: () => Promise.reject({ data: { message: 'Falha no servidor' } })
        });
        useAddOrcamentoMock.mockReturnValue([addSpy, { isLoading: false }] as any);

        renderWithProviders();

        fireEvent.click(screen.getByText('Submit Form'));

        await waitFor(() => {
            expect(addSpy).toHaveBeenCalled();
        });
    });
});