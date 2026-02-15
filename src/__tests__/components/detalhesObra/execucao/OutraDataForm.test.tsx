import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAddOutraDataMutation } from '../../../../services/execucaoApi';
import notificacaoReducer from '../../../../features/notificacaoSlice';
import { OutraDataForm } from '../../../../components/detalhesObra/execucao/OutraDataForm';
import userEvent from '@testing-library/user-event';

vi.mock('../../../../services/execucaoApi', () => ({
    useAddOutraDataMutation: vi.fn(),
}));

const useAddOutraDataMock = vi.mocked(useAddOutraDataMutation);

const renderWithProviders = () => {
    const store = configureStore({
        reducer: { notificacao: notificacaoReducer },
    });

    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={['/obra/1/nova-data/10']}>
                <Routes>
                    <Route path="/obra/:idObra/nova-data/:idItem" element={<OutraDataForm />} />
                    <Route path="/obra/1" element={<div>Página da Obra</div>} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
};

describe('OutraDataForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar o formulário', () => {
        useAddOutraDataMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        renderWithProviders();
        expect(screen.getByText(/Nome:/i)).toBeInTheDocument();
        expect(screen.getByText(/Data:/i)).toBeInTheDocument();
        expect(screen.getByText(/Salvar/i)).toBeInTheDocument();
        expect(screen.getByText(/Cancelar/i)).toBeInTheDocument();
    });

    it('deve validar que os campos Nome e Data são obrigatórios', async () => {
        useAddOutraDataMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        renderWithProviders();

        const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
        fireEvent.click(btnSalvar);

        expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument();
    });

    it('deve enviar o payload formatado corretamente com o fuso horário ao salvar', async () => {
        const addSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        useAddOutraDataMock.mockReturnValue([addSpy, { isLoading: false }] as any);

        renderWithProviders();

        const nomeInput = document.getElementById('outa-data-nome-input');
        if(nomeInput){
            await userEvent.type(nomeInput, 'Entrega das Janelas');
        }

        const dataInput = document.getElementById('outa-data-data-input');
        if(dataInput){
            fireEvent.change(dataInput, { target: { value: '2025-05-20T14:30' } });
        }

        fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

        await waitFor(() => {
            expect(addSpy).toHaveBeenCalledWith({
                nome: 'Entrega das Janelas',
                data: '2025-05-20T14:30-03:00',
                idItem: 10,
                idObra: 1
            });
        });
    });

    it('deve navegar de volta para a obra ao clicar em cancelar', () => {
        useAddOutraDataMock.mockReturnValue([vi.fn(), { isLoading: false }] as any);
        renderWithProviders();

        const btnCancelar = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(btnCancelar);

        expect(screen.getByText('Página da Obra')).toBeInTheDocument();
    });

    it('deve desabilitar campos e mostrar spinner durante o carregamento', () => {
        useAddOutraDataMock.mockReturnValue([vi.fn(), { isLoading: true }] as any);
        renderWithProviders();

        expect(screen.getByRole('button', { name: /Salvar/i })).toBeDisabled();
    });
});