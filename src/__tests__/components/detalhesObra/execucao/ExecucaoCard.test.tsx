import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DatePickerProps } from '../../../../components/common/DatePicker';
import { ExecucaoCard } from '../../../../components/detalhesObra/execucao/ExecucaoCard';
import notificacaoReducer from '../../../../features/notificacaoSlice';
import {
    useEditarComentarioExecucaoMutation,
    useEditarOutraDataMutation,
    useEditarPrevisaoMutation,
    useObterExecucaoQuery,
    useRemoverOutraDataMutation
} from '../../../../services/execucaoApi';
import type { Execucao } from '../../../../types/Execucao';
import { type AcoesButtonsMockProps, AcoesButtonsMock } from '../../../mocks/AcoesButtonsMock';

vi.mock('../../../../services/execucaoApi', () => ({
    useObterExecucaoQuery: vi.fn(),
    useEditarPrevisaoMutation: vi.fn(),
    useEditarComentarioExecucaoMutation: vi.fn(),
    useRemoverOutraDataMutation: vi.fn(),
    useEditarOutraDataMutation: vi.fn(),
}));

vi.mock('../../../../components/common/AcoesButton', () => ({
    AcoesButton: (props: AcoesButtonsMockProps) => <AcoesButtonsMock {...props}/>,
}));

vi.mock('../../../../components/common/DatePicker', () => ({
    DatePicker: ({ onChange, loading, label, id }: DatePickerProps) => (
        <div data-testid="datepicker-container">
            {label && <label>{label}</label>}
            <input
                data-testid={id}
                type="date"
                disabled={loading}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    ),
}));

vi.mock('../../../../components/common/ComentarioInput', () => ({
    ComentarioInput: ({ initialValue, alterarComentario, disabled }: {initialValue: string, alterarComentario: (novoComentario: string) => void, disabled?: boolean}) => (
        <div data-testid="comentario-container">
            <textarea
                data-testid="mock-comentarios-input"
                defaultValue={initialValue}
                disabled={disabled}
                onChange={(e) => alterarComentario(e.target.value)}
            />
        </div>
    ),
}));

const mockExecucao: Execucao = {
    inicio: '2026-12-31',
    termino: '2027-01-30',
    comentarios: 'Obra em andamento',
    itemObraId: 1,
    datasAdicionais: [
        { id: 10, nome: 'Entrega Piso', data: '2026-11-15' }
    ]
};

const renderWithProviders = (props = { idItem: 1, idObra: 123 }) => {
    const store = configureStore({
        reducer: { notificacao: notificacaoReducer },
    });
    return render(
        <Provider store={store}>
            <MemoryRouter>
                <ExecucaoCard {...props} />
            </MemoryRouter>
        </Provider>
    );
};

describe('ExecucaoCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (useEditarPrevisaoMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
        (useEditarComentarioExecucaoMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
        (useRemoverOutraDataMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
        (useEditarOutraDataMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
    });

    it('deve renderizar a data de previsão e o comentário corretamente', () => {
        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });
        renderWithProviders();

        expect(screen.getByText(/Início/i)).toBeInTheDocument();
        expect(screen.getByDisplayValue('Obra em andamento')).toBeInTheDocument();
        expect(screen.getByText(/Término/i)).toBeInTheDocument();
    });

    it('deve calcular a diferença de dias corretamente (Contagem Regressiva)', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-12-01'));

        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });
        renderWithProviders();

        expect(screen.getByText(/Duração:/i)).toBeInTheDocument();
        
        vi.useRealTimers();
    });

    it.each(['inicio', 'termino'])('deve chamar editarPrevisao quando a data do DatePicker for alterada', async (data: string) => {
        const editarComentarioSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        (useEditarComentarioExecucaoMutation as any).mockReturnValue([editarComentarioSpy, { isLoading: false }]);
        const editarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        (useEditarPrevisaoMutation as any).mockReturnValue([editarSpy, { isLoading: false }]);
        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });

        renderWithProviders();

        const input = screen.getByTestId(`previsao-${data}`); 
        fireEvent.change(input, { target: { value: '2027-01-01' } });

        await waitFor(() => {
            expect(editarSpy).toHaveBeenCalled();
        });
    });

    it('deve chamar removerOutraData ao clicar no botão de Deletar', async () => {
        const removerSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        (useRemoverOutraDataMutation as any).mockReturnValue([removerSpy, { isLoading: false }]);
        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });

        renderWithProviders();

        const btnDeletar = screen.getByRole('button', { name: /Deletar/i });
        fireEvent.click(btnDeletar);

        expect(removerSpy).toHaveBeenCalledWith({
            id: 10,
            idItem: 1,
            idObra: 123,
        }); 
    });

    it('deve chamar alterarComentario quando editar o comentário', async () => {
        const editarComentarioSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        (useEditarComentarioExecucaoMutation as any).mockReturnValue([editarComentarioSpy, { isLoading: false }]);
        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });

        renderWithProviders();

        const comentarioInput = screen.getByTestId('mock-comentarios-input');
        fireEvent.change(comentarioInput, {target: {value: 'Novo Comentário'}});

        expect(editarComentarioSpy).toHaveBeenCalled(); 
    });

    it('deve exibir o link para adicionar outra data com os IDs corretos', () => {
        (useObterExecucaoQuery as any).mockReturnValue({ data: mockExecucao, isLoading: false });
        renderWithProviders({ idItem: 1, idObra: 123 });

        const link = screen.getByRole('link', { name: /Adicionar outra data/i });
        expect(link).toHaveAttribute('href', '/obra/123/nova-data/1');
    });
});