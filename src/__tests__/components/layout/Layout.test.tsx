import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Layout } from '../../../components/layout/Layout';

vi.mock('../../../components/common/Notificacao', () => ({
  Notificacao: ({ className }: { className: string }) => (
    <div data-testid="mock-notificacao" className={className}>Notificacao</div>
  )
}));

vi.mock('../../../components/layout/Header', () => ({
  Header: ({ className }: { className: string }) => (
    <div data-testid="mock-header" className={className}>Header</div>
  )
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Outlet: () => <div data-testid="mock-outlet">Conteúdo da Rota</div>
    };
});

describe('Layout Component', () => {
    
    it('deve renderizar a estrutura básica com Header, Footer e Notificacao', () => {
        render(<Layout />);

        expect(screen.getByTestId('mock-notificacao')).toBeInTheDocument();
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();
        expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
    });
});