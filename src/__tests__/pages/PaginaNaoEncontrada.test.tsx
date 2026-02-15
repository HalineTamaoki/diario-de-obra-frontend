import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import PaginaNaoEncontrada from '../../pages/PaginaNaoEncontrada';

describe('PaginaNaoEncontrada Component', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window.history, 'back').mockImplementation(() => {});
        vi.stubGlobal('location', {
            href: '',
            assign: vi.fn(),
        });
    });

    afterAll(() => {
        vi.unstubAllGlobals();
    });

    test('deve renderizar as informações de erro 404', () => {
        render(<PaginaNaoEncontrada />);

        expect(screen.getByText('404')).toBeInTheDocument();
        expect(screen.getByText(/Página Não Encontrada/i)).toBeInTheDocument();
        expect(
            screen.getByText(/Desculpe, a página que você está procurando não existe/i)
        ).toBeInTheDocument();
    });

    test('deve chamar window.history.back() ao clicar no botão Voltar', async () => {
        const user = userEvent.setup();
        render(<PaginaNaoEncontrada />);

        const btnVoltar = screen.getByRole('button', { name: /voltar/i });
        await user.click(btnVoltar);

        expect(window.history.back).toHaveBeenCalledTimes(1);
    });

    test('deve alterar window.location.href para "/" ao clicar no botão Ir para Início', async () => {
        const user = userEvent.setup();
        render(<PaginaNaoEncontrada />);

        const btnInicio = screen.getByRole('button', { name: /ir para início/i });
        await user.click(btnInicio);

        expect(window.location.href).toBe('/');
    });
});