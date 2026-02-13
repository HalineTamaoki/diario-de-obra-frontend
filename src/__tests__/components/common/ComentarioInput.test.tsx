import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ComentarioInput } from '../../../components/common/ComentarioInput';

describe('ComentarioInput', () => {
    const mockAlterarComentario = vi.fn();
    const initialValue = 'Comentário inicial';

    beforeEach(() => {
        vi.useFakeTimers();
        mockAlterarComentario.mockClear();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('deve inicializar com o valor correto', () => {
        render(
            <ComentarioInput 
                initialValue={initialValue} 
                alterarComentario={mockAlterarComentario} 
            />
        );
        
        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue(initialValue);
    });

    it('deve chamar alterarComentario após 1 segundo de inatividade (Debounce)', () => {
        render(
            <ComentarioInput 
                initialValue={initialValue} 
                alterarComentario={mockAlterarComentario} 
            />
        );
        
        const textarea = screen.getByRole('textbox');
        
        fireEvent.change(textarea, { target: { value: 'Novo conteúdo' } });

        expect(mockAlterarComentario).not.toBeCalled();
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(mockAlterarComentario).toHaveBeenCalledWith('Novo conteúdo');
        expect(mockAlterarComentario).toHaveBeenCalledTimes(1);
    });

    it('deve chamar alterarComentario imediatamente ao perder o foco (onBlur)', () => {
        render(
            <ComentarioInput 
                initialValue={initialValue} 
                alterarComentario={mockAlterarComentario} 
            />
        );
        
        const textarea = screen.getByRole('textbox');
        
        fireEvent.change(textarea, { target: { value: 'Conteúdo via blur' } });
        fireEvent.blur(textarea);

        expect(mockAlterarComentario).toHaveBeenCalledWith('Conteúdo via blur');
    });

    it('não deve chamar alterarComentario se o valor for igual ao initialValue', () => {
        render(
            <ComentarioInput 
                initialValue={initialValue} 
                alterarComentario={mockAlterarComentario} 
            />
        );
        
        const textarea = screen.getByRole('textbox');
                fireEvent.blur(textarea);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(mockAlterarComentario).not.toHaveBeenCalled();
    });

    it('deve atualizar o valor interno se a prop initialValue mudar externamente', () => {
        const { rerender } = render(
            <ComentarioInput 
                initialValue="Valor A" 
                alterarComentario={mockAlterarComentario} 
            />
        );

        rerender(
            <ComentarioInput 
                initialValue="Valor B" 
                alterarComentario={mockAlterarComentario} 
            />
        );

        const textarea = screen.getByRole('textbox');
        expect(textarea).toHaveValue('Valor B');
    });

    it('deve respeitar a propriedade disabled', () => {
        render(
            <ComentarioInput 
                initialValue={initialValue} 
                alterarComentario={mockAlterarComentario} 
                disabled={true}
            />
        );
        
        const textarea = screen.getByRole('textbox');
        expect(textarea).toBeDisabled();
    });
});