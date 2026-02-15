import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IdeacaoImg } from '../../../../components/detalhesObra/ideacao/IdeacaoImg';

vi.mock('../../../../assets/imagePlaceholder.png', () => ({
    default: 'placeholder-mock-url'
}));

describe('IdeacaoImg', () => {
    const mockImageUrl = 'https://exemplo.com/foto.jpg';
    const mockExternalUrl = 'https://site-externo.com';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
    });

    it('deve exibir a imagem diretamente se o URL terminar com uma extensão de imagem válida', () => {
        render(<IdeacaoImg url={mockImageUrl} />);
        
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', mockImageUrl);
        expect(img).toHaveAttribute('id', `ideacao-imagem-${mockImageUrl}`);
    });

    it('deve fazer uma chamada à API do Microlink se o URL não for uma imagem direta', async () => {
        const mockApiResponse = {
            data: { image: { url: 'https://microlink.io/imagem-capturada.png' } }
        };

        vi.mocked(fetch).mockResolvedValue({
            json: () => Promise.resolve(mockApiResponse),
        } as Response);

        render(<IdeacaoImg url={mockExternalUrl} />);

        await waitFor(() => {
            const img = screen.getByRole('img');
            expect(img).toHaveAttribute('src', 'https://microlink.io/imagem-capturada.png');
        });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(encodeURIComponent(mockExternalUrl))
        );
    });

    it('deve exibir o placeholder em caso de erro na chamada da API', async () => {
        vi.mocked(fetch).mockRejectedValue(new Error('Falha na rede'));

        render(<IdeacaoImg url={mockExternalUrl} />);

        await waitFor(() => {
            const img = screen.getByRole('img');
            expect(img).toHaveAttribute('src', mockExternalUrl);
        });
    });

    it('deve mudar para o placeholder se a imagem disparar um erro de carregamento (onError)', () => {
        render(<IdeacaoImg url={mockImageUrl} />);
        
        const img = screen.getByRole('img');
        
        fireEvent.error(img);

        expect(img).toHaveAttribute('src', 'placeholder-mock-url');
        expect(img).toHaveAttribute('alt', 'Imagem não disponível');
    });
});