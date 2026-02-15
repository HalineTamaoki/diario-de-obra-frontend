import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PageLayout } from '../../../components/layout/PageLayout';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('PageLayout Component', () => {
    const defaultProps = {
        id: 'test-page',
        titulo: 'Meu Título',
        children: <div data-testid="child-content">Conteúdo Interno</div>,
    };

    test('deve renderizar o título e o conteúdo corretamente', () => {
        renderWithRouter(<PageLayout {...defaultProps} />);

        expect(screen.getByText('Meu Título')).toBeInTheDocument();
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
    });

    test('deve renderizar como um link quando backPath for fornecido', () => {
        renderWithRouter(<PageLayout {...defaultProps} backPath="/home" />);
                const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/home');
    });

    test('deve chamar a função onClick quando o link de voltar for clicado', () => {
        const onClickMock = vi.fn();
        renderWithRouter(
            <PageLayout {...defaultProps} backPath="/home" onClick={onClickMock} />
        );

        const linkElement = screen.getByRole('link');
        fireEvent.click(linkElement);

        expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    test('não deve renderizar link se backPath não for enviado', () => {
        renderWithRouter(<PageLayout {...defaultProps} />);
        
        const linkElement = screen.queryByRole('link');
        expect(linkElement).not.toBeInTheDocument();
    });
});