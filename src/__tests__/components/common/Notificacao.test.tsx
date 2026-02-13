import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Notificacao } from '../../../components/common/Notificacao';
import { ocultarNotificacao } from '../../../features/notificacaoSlice';
import * as hooks from '../../../hooks/useAppDispatch';

vi.mock('../../../hooks/useAppDispatch');
vi.mock('../../../features/notificacaoSlice', () => ({
    ocultarNotificacao: vi.fn(() => ({ type: 'notificacao/ocultar' })),
}));

describe('Notificacao Component', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        (hooks.useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('não deve renderizar nada quando não houver notificação', () => {
        (hooks.useAppSelector as any).mockReturnValue(null);
        
        const { container } = render(<Notificacao />);
        expect(container.firstChild).toBeNull();
    });

    it('deve renderizar a mensagem e a variante correta quando houver notificação', () => {
        const notificacaoFake = { mensagem: 'Sucesso!', variant: 'success' };
        (hooks.useAppSelector as any).mockReturnValue(notificacaoFake);

        render(<Notificacao />);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Sucesso!');
        expect(alert).toHaveClass('alert-success');
    });

    it('deve disparar ocultarNotificacao após 3 segundos (3000ms)', () => {
        const notificacaoFake = { mensagem: 'Aviso', variant: 'warning' };
        (hooks.useAppSelector as any).mockReturnValue(notificacaoFake);

        render(<Notificacao />);

        expect(mockDispatch).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(mockDispatch).toHaveBeenCalledWith(ocultarNotificacao());
    });

    it('deve aplicar a classe customizada via props', () => {
        const notificacaoFake = { mensagem: 'Erro', variant: 'danger' };
        (hooks.useAppSelector as any).mockReturnValue(notificacaoFake);

        render(<Notificacao className="minha-classe-extra" />);

        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('minha-classe-extra');
    });
});