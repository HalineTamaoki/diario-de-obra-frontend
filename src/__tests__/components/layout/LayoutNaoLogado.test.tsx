import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LayoutNaoLogado } from '../../../components/layout/LayoutNaoLogado';

vi.mock('../../../components/common/Notificacao', () => ({
  Notificacao: ({ className }: { className: string }) => (
    <div data-testid="mock-notificacao" className={className}>Notificacao</div>
  )
}));

describe('Layout Component', () => {
    
    it('deve renderizar a estrutura básica com Notificacao e children', () => {
        render(<LayoutNaoLogado >
          <div>Children</div>
        </LayoutNaoLogado>);

        expect(screen.getByTestId('mock-notificacao')).toBeInTheDocument();
        expect(screen.getByText('Children')).toBeInTheDocument();
    });
});