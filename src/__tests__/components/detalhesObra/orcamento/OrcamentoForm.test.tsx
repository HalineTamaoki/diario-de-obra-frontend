import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OrcamentoForm } from '../../../../components/detalhesObra/orcamento/OrcamentoForm';

describe('OrcamentoForm', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    const renderWithRouter = (props = {}) => {
        return render(
            <MemoryRouter initialEntries={['/obra/1/orcamento/10/novo']}>
                <Routes>
                    <Route 
                        path="/obra/:idObra/orcamento/:idItem/novo" 
                        element={
                            <OrcamentoForm 
                                onSubmit={mockOnSubmit} 
                                onCancel={mockOnCancel} 
                                {...props} 
                            />
                        } 
                    />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('deve renderizar todos os campos básicos do formulário', () => {
        renderWithRouter();

        expect(screen.getByText(/Valor:/i)).toBeInTheDocument();
        expect(screen.getByText(/Data:/i)).toBeInTheDocument();
        expect(screen.getByText(/Comentários:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument();
    });

    it('deve exibir o campo Empresa quando a prop mostrarCampoEmpresa for true', () => {
        renderWithRouter({ mostrarCampoEmpresa: true });
        expect(screen.getByText(/Empresa:/i)).toBeInTheDocument();
    });

    it('deve validar campos obrigatórios e exibir mensagens de erro', async () => {
        renderWithRouter({ mostrarCampoEmpresa: true });
        
        const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
        fireEvent.click(btnSalvar);

        expect(await screen.findByText(/Empresa é obrigatória/i)).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve chamar onSubmit com os dados formatados corretamente ao preencher o formulário', async () => {
        renderWithRouter({ mostrarCampoEmpresa: true });

        fireEvent.change(document.getElementsByName('empresa')[0], { 
            target: { value: 'Fornecedor', name: 'empresa' } 
        });
        fireEvent.input(screen.getByRole('spinbutton'), { target: { value: '1500.50' } }); 
        
        const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
        fireEvent.click(btnSalvar);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                empresa: 'Fornecedor',
                valor: 1500.5,
                idItem: 10 
            }));
        });
    });

    it('deve preencher o formulário com valores iniciais quando fornecidos', () => {
        const valorInicial = {
            idItem: 10,
            empresa: 'Fornecedor Antigo',
            valor: 500,
            data: '2023-10-27T10:00:00Z',
            comentarios: 'Nota fiscal pendente'
        };

        renderWithRouter({ valorInicial, mostrarCampoEmpresa: true });

        expect(screen.getByDisplayValue('Fornecedor Antigo')).toBeInTheDocument();
        expect(screen.getByDisplayValue('500')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Nota fiscal pendente')).toBeInTheDocument();
    });

    it('deve chamar onCancel ao clicar no botão cancelar', () => {
        renderWithRouter();
        
        const btnCancelar = screen.getByRole('button', { name: /Cancelar/i });
        fireEvent.click(btnCancelar);

        expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });

    it('deve desativar os botões quando a prop loading for true', () => {
        renderWithRouter({ loading: true });
        
        expect(screen.getByRole('button', { name: /Salvar/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled();
    });
});