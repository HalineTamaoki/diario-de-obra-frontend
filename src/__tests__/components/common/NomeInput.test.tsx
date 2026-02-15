import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NomeInput } from '../../../components/common/NomeInput';

describe('NomeInput', () => {
    const mockEditar = vi.fn();
    const mockSairModoEdicao = vi.fn();
    const propsPadrao = {
        id: 'input-nome',
        valorInicial: 'João',
        defaultValue: 'Sem Nome',
        editar: mockEditar,
        sairModoEdicao: mockSairModoEdicao,
    };

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('deve renderizar com o valor inicial e foco automático', () => {
        render(<NomeInput {...propsPadrao} />);
        const input = screen.getByRole('textbox');
        
        expect(input).toHaveValue('João');
        expect(input).toHaveFocus();
    });

    it('deve chamar editar com o novo valor após 1 segundo de debounce', () => {
        render(<NomeInput {...propsPadrao} />);
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Carlos' } });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(mockEditar).toHaveBeenCalledWith('Carlos');
    });

    it('deve salvar e sair do modo de edição ao pressionar Enter', () => {
        render(<NomeInput {...propsPadrao} />);
        const input = screen.getByRole('textbox');

        fireEvent.change(input, { target: { value: 'Novo Nome' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

        expect(mockEditar).toHaveBeenCalledWith('Novo Nome');
        expect(mockSairModoEdicao).toHaveBeenCalled();
    });

    it('deve chamar sairModoEdicao ao perder o foco (onBlur)', () => {
        render(<NomeInput {...propsPadrao} />);
        const input = screen.getByRole('textbox');

        fireEvent.blur(input);

        expect(mockSairModoEdicao).toHaveBeenCalled();
    });

    it('não deve disparar editar se o valor for igual ao inicial', () => {
        render(<NomeInput {...propsPadrao} />);
        
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(mockEditar).not.toHaveBeenCalled();
    });
});