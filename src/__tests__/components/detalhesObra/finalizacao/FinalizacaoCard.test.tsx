import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type DatePickerProps } from '../../../../components/common/DatePicker';
import { FinalizadoCard } from '../../../../components/detalhesObra/finalizado/FinalizadoCard';
import notificacaoReducer from '../../../../features/notificacaoSlice';
import {
    useEditarComentarioFinalizacaoMutation,
    useEditarDataFinalizacaoMutation,
    useMarcarFinalizadoMutation,
    useObterFinalizacaoQuery
} from '../../../../services/finalizacaoApi';

vi.mock('../../../../services/finalizacaoApi', () => ({
    useObterFinalizacaoQuery: vi.fn(),
    useEditarComentarioFinalizacaoMutation: vi.fn(),
    useEditarDataFinalizacaoMutation: vi.fn(),
    useMarcarFinalizadoMutation: vi.fn(),
}));

vi.mock('../../../../components/common/DatePicker', () => ({
    DatePicker: ({ value, onChange, loading, id }: DatePickerProps) => (
        <input 
            data-testid={id}
            type="date" 
            defaultValue={value} 
            disabled={loading}
            onChange={(e) => onChange(e.target.value)} 
        />
    )
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

const renderWithProviders = (props = { idItem: 1, idObra: 10 }) => {
    const store = configureStore({
        reducer: { notificacao: notificacaoReducer },
    });
    return render(<Provider store={store}><FinalizadoCard {...props} /></Provider>);
};

describe('FinalizadoCard', () => {
    const mockData = { id: 100, data: '2023-10-27', comentarios: 'Tudo pronto!' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useEditarComentarioFinalizacaoMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
        (useEditarDataFinalizacaoMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
        (useMarcarFinalizadoMutation as any).mockReturnValue([vi.fn(), { isLoading: false }]);
    });

    it('deve exibir a data e o comentário quando o item já está finalizado', () => {
        (useObterFinalizacaoQuery as any).mockReturnValue({ data: mockData, isLoading: false });
        renderWithProviders();

        expect(screen.getByTestId('conclusao')).toHaveValue('2023-10-27');
        expect(screen.getByTestId('mock-comentarios-input')).toHaveValue('Tudo pronto!');
        expect(screen.getByRole('button', { name: /Desmarcar finalizado/i })).toBeInTheDocument();
    });

    it('deve exibir "Marcar como finalizado" quando não há data de conclusão', () => {
        (useObterFinalizacaoQuery as any).mockReturnValue({ data: { data: null }, isLoading: false });
        renderWithProviders();

        expect(screen.getByRole('button', { name: /Marcar como finalizado/i })).toBeInTheDocument();
    });

    it('deve chamar editarDataFinalizacao ao mudar a data', async () => {
        const editarDataSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
        (useEditarDataFinalizacaoMutation as any).mockReturnValue([editarDataSpy, { isLoading: false }]);
        (useObterFinalizacaoQuery as any).mockReturnValue({ data: mockData, isLoading: false });

        renderWithProviders();

        fireEvent.change(screen.getByTestId('conclusao'), { target: { value: '2023-12-25' } });

        expect(editarDataSpy).toHaveBeenCalledWith(expect.objectContaining({
            data: '2023-12-25',
            idItem: 1
        }));
    });

    it('deve chamar marcarFinalizado ao clicar no botão principal', async () => {
        const marcarSpy = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve(), catch: () => Promise.resolve() });
        (useMarcarFinalizadoMutation as any).mockReturnValue([marcarSpy, { isLoading: false }]);
        (useObterFinalizacaoQuery as any).mockReturnValue({ data: mockData, isLoading: false });

        renderWithProviders();

        fireEvent.click(screen.getByRole('button', { name: /Desmarcar finalizado/i }));

        expect(marcarSpy).toHaveBeenCalledWith(expect.objectContaining({ idItem: 1 }));
    });

    it('deve mostrar LoadingContainer durante o carregamento inicial', () => {
        (useObterFinalizacaoQuery as any).mockReturnValue({ data: undefined, isLoading: true });
        renderWithProviders();
        
        expect(screen.queryByTestId('conclusao')).not.toBeInTheDocument();
    });
});