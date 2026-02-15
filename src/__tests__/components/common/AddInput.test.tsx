import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AddInput } from '../../../components/common/AddInput';

const mockDispatch = vi.fn();
vi.mock('../../../hooks/useAppDispatch', () => ({
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../features/notificacaoSlice', () => ({
    mostrarNotificacao: vi.fn((payload) => ({ type: 'notificacao/mostrar', payload })),
}));

describe('AddInput Component', () => {
    const mockAdd = vi.fn();
    const defaultProps = {
        add: mockAdd,
        id: 'test-input',
        placeholder: 'Digite algo...',
    };

    beforeEach(() => {
        mockAdd.mockClear();
    });

    it('deve renderizar o placeholder corretamente', () => {
        render(<AddInput {...defaultProps} />);
        expect(screen.getByPlaceholderText('Digite algo...')).toBeInTheDocument();
    });

    it('deve atualizar o valor do input ao digitar', () => {
        render(<AddInput {...defaultProps} />);
        const input = screen.getByPlaceholderText('Digite algo...') as HTMLInputElement;
        
        fireEvent.change(input, { target: { value: 'Nova Tarefa' } });
        expect(input.value).toBe('Nova Tarefa');
    });

    it('deve chamar a função add e limpar o input ao clicar no botão', () => {
        render(<AddInput {...defaultProps} />);
        const input = screen.getByPlaceholderText('Digite algo...');
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'Comprar leite' } });
        fireEvent.click(button);

        expect(mockAdd).toHaveBeenCalledWith('Comprar leite');
        expect(input).toHaveValue('');
    });

    it('não deve chamar a função add se o input estiver vazio', () => {
        render(<AddInput {...defaultProps} />);
        const button = screen.getByRole('button');

        fireEvent.click(button);
        expect(mockAdd).not.toHaveBeenCalled();
    });

    it('deve chamar a função add ao pressionar a tecla Enter', () => {
        render(<AddInput {...defaultProps} />);
        const input = screen.getByPlaceholderText('Digite algo...');

        fireEvent.change(input, { target: { value: 'Estudar Testes' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockAdd).toHaveBeenCalledWith('Estudar Testes');
    });

    it('deve exibir o spinner e desabilitar o botão quando loading for true', () => {
        render(<AddInput {...defaultProps} loading={true} />);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(document.querySelector('.spinner-border')).toBeInTheDocument();
    });
});