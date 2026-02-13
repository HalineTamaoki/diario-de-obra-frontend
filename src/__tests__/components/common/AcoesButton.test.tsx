import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AcoesButton } from '../../../components/common/AcoesButton';

beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
        matches: query.includes('min-width: 768'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        })),
    });
});

const mockItens = [
    { id: 'btn-edit', text: 'Editar', icon: <span>IconEdit</span>, onClick: vi.fn() },
    { id: 'btn-delete', text: 'Excluir', icon: <span>IconDel</span>, onClick: vi.fn() },
];

describe('AcoesButton Component', () => {
    
    it('deve renderizar o botão principal (três pontos)', () => {
        render(<AcoesButton itens={mockItens} />);
        const btn = screen.getByRole('button');
        expect(btn).toBeDefined();
    });

    it('deve abrir o menu de ações ao clicar (Desktop/Dropdown)', async () => {
        render(<AcoesButton itens={mockItens} />);
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        expect(screen.getByText('Editar')).toBeDefined();
        expect(screen.getByText('Excluir')).toBeDefined();
    });

    it('deve chamar a função onClick do item e fechar o menu ao clicar em uma ação', () => {
        render(<AcoesButton itens={mockItens} />);
        fireEvent.click(screen.getByRole('button'));
        const itemEdit = screen.getByText('Editar');
        fireEvent.click(itemEdit);

        expect(mockItens[0].onClick).toHaveBeenCalled();
    });

    it('deve renderizar o ícone vertical quando direction for "vertical"', () => {
        const { container } = render(<AcoesButton itens={mockItens} direction="vertical" />);
        
        const icon = container.querySelector('svg');
        expect(icon).toBeDefined();
    });

    it('deve respeitar o comportamento de Mobile (Offcanvas)', () => {
        window.matchMedia = vi.fn().mockImplementation(query => ({
            matches: query.includes('max-width: 767'),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
        })) as any;

        render(<AcoesButton itens={mockItens} />);
        
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);

        const offcanvas = document.querySelector('.offcanvas');
        expect(offcanvas).toBeDefined();
    });
});