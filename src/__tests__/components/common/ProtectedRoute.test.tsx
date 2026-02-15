import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import ProtectedRoute from '../../../components/common/ProtectedRoute';

const createMockStore = (token: any) => 
    configureStore({
        reducer: {
            auth: () => ({ token }),
        },  
});

describe('ProtectedRoute', () => {
  
    const renderProtectedRoute = (token: any, initialEntries = ['/dashboard']) => {
        const store = createMockStore(token);
        return render(
            <Provider store={store}>
                <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/login" element={<span>Página de Login</span>} />
                    <Route path="/cadastro" element={<span>Página de Cadastro</span>} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<span>Home</span>} />
                    <Route path="/dashboard" element={<span>Conteúdo Protegido</span>} />
                    </Route>
                </Routes>
                </MemoryRouter>
            </Provider>
        );
    };

    it('deve redirecionar para /login se não houver token', () => {
        renderProtectedRoute(null, ['/dashboard']);
        expect(screen.getByText('Página de Login')).toBeInTheDocument();
    });

    it('deve redirecionar para /login se o token estiver expirado', () => {
        const tokenExpirado = { validTo: '2020-01-01' };
        
        renderProtectedRoute(tokenExpirado, ['/dashboard']);
        expect(screen.getByText('Página de Login')).toBeInTheDocument();
    });

    it('deve permitir acesso ao conteúdo (Outlet) se o token for válido', () => {
        const tokenValido = { validTo: '2099-01-01' };
        
        renderProtectedRoute(tokenValido, ['/dashboard']);
        expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
    });

    it('deve redirecionar para a Login se o usuário logado tentar acessar /login', () => {
        const tokenValido = { validTo: '2099-01-01' };
        
        renderProtectedRoute(tokenValido, ['/login']);
        expect(screen.getByText('Página de Login')).toBeInTheDocument();
    });

    it('deve permitir acesso à página de cadastro se o usuário NÃO estiver logado', () => {
        renderProtectedRoute(null, ['/cadastro']);
        expect(screen.getByText('Página de Cadastro')).toBeInTheDocument();
    });
});