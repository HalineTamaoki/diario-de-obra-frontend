import { render, screen } from '@testing-library/react';
import { App } from '../app';

vi.mock('../navigation/AppRoutes', () => ({
    AppRoutes: () => <div data-testid="routes-mock">Conteúdo das Rotas</div>
}));

describe('Componente App', () => {
    it('deve renderizar o provedor de rotas e o conteúdo principal', () => {
        render(<App />);
        
        const routesElement = screen.getByTestId('routes-mock');
        expect(routesElement).toBeInTheDocument();
    });
});