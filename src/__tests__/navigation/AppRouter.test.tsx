import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AppRoutes } from '../../navigation/AppRoutes';

vi.mock('../../pages/Obra', () => ({ Obra: () => <div>Página de Obras</div> }));
vi.mock('../../pages/DetalhesObra', () => ({ DetalhesObra: () => <div>Detalhes da Obra</div> }));
vi.mock('../../pages/Login', () => ({ Login: () => <div>Página de Login</div> }));
vi.mock('../../pages/PaginaNaoEncontrada', () => ({ default: () => <div>404 - Não Encontrada</div> }));

vi.mock('../../components/common/ProtectedRoute', () => ({
  default: () => <Outlet />, 
}));

vi.mock('../../components/layout/Layout', () => ({
    Layout: () => <Outlet />,
}));

vi.mock('../../services/authApi', () => ({
    useLoginMutation: vi.fn(),
}));

describe('AppRoutes Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        vi.stubGlobal('location', { pathname: '/' });
    });

    test('deve renderizar a página inicial (Obra) quando não há última obra no storage', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(screen.getByText('Página de Obras')).toBeInTheDocument();
    });

    test('deve redirecionar para a última obra vista se existir no sessionStorage', () => {
        sessionStorage.setItem('ultimaObraVista', '123');

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />   
            </MemoryRouter>
        );

        expect(screen.getByText('Detalhes da Obra')).toBeInTheDocument();
    });

    test('deve remover "ultimaObraVista" se o valor for "0" e manter na home', () => {
        sessionStorage.setItem('ultimaObraVista', '0');
        const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

        render(
            <MemoryRouter initialEntries={['/']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(removeItemSpy).toHaveBeenCalledWith('ultimaObraVista');
        expect(screen.getByText('Página de Obras')).toBeInTheDocument();
    });

    test('deve renderizar 404 para rotas inexistentes', () => {
        render(
            <MemoryRouter initialEntries={['/rota-que-nao-existe']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(screen.getByText('404 - Não Encontrada')).toBeInTheDocument();
    });

    test('deve renderizar a página de login corretamente', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <AppRoutes />
            </MemoryRouter>
        );

        expect(screen.getByText('Página de Login')).toBeInTheDocument();
    });
});