import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as hooks from '../../../hooks/useAppDispatch';
import { logout } from '../../../features/authSlice';
import { Header } from '../../../components/layout/Header';

vi.mock('../../../hooks/useAppDispatch');
vi.mock('../../../features/authSlice', () => ({
    logout: vi.fn(() => ({ type: 'auth/logout' })),
}));

describe('Header Component', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (hooks.useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('deve renderizar o header e o botão de logout', () => {
        render(<Header />);
        
        const header = screen.getByRole('banner');
        const button = screen.getByRole('button');
        
        expect(header).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it('deve disparar a action logout ao clicar no botão', () => {
        render(<Header />);
        
        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(logout());
    });
});