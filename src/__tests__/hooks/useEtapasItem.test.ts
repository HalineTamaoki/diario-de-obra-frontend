import { renderHook } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEtapasItem } from '../../hooks/useEtapasItem';
import { obraApi } from '../../services/obraApi';

vi.mock('../../hooks/useAppDispatch', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('../../services/obraApi', () => ({
    obraApi: {
        util: {
            updateQueryData: vi.fn(),
        },
    },
}));

describe('useEtapasItem Hook', () => {
    const mockDispatch = vi.fn();
    const idObra = 1;
    const idItem = 10;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
    });

    test('deve avançar a etapa de "ideacao" para "orcamento"', () => {
        const { result } = renderHook(() => useEtapasItem(idObra));

        result.current.avancarEtapa(idItem);

        expect(obraApi.util.updateQueryData).toHaveBeenCalledWith(
            'obterObraDetalhada',
            idObra,
            expect.any(Function) 
        );

        const recipe = vi.mocked(obraApi.util.updateQueryData).mock.calls[0][2];
        const draft = {
            items: [{ id: idItem, ultimaEtapa: 'ideacao' }]
        };

        // @ts-ignore
        recipe(draft);
        expect(draft.items[0].ultimaEtapa).toBe('orcamento');
    });

    test('deve voltar a etapa de "execucao" para "orcamento"', () => {
        const { result } = renderHook(() => useEtapasItem(idObra));

        result.current.voltarEtapa(idItem);

        const recipe = vi.mocked(obraApi.util.updateQueryData).mock.calls[0][2];
        const draft = {
        items: [{ id: idItem, ultimaEtapa: 'execucao' }]
        };

        // @ts-ignore
        recipe(draft);

        expect(draft.items[0].ultimaEtapa).toBe('orcamento');
    });

    test('deve avançar para "ideacao" se tentar avançar além do limite', () => {
        const { result } = renderHook(() => useEtapasItem(idObra));
        result.current.avancarEtapa(idItem);

        const recipe = vi.mocked(obraApi.util.updateQueryData).mock.calls[0][2];
        const draft = { items: [{ id: idItem, ultimaEtapa: 'finalizado' }] };

        // @ts-ignore
        recipe(draft);

        expect(draft.items[0].ultimaEtapa).toBe('ideacao');
    });

    test('não deve alterar nada se o item não for encontrado no draft', () => {
        const { result } = renderHook(() => useEtapasItem(idObra));
        result.current.avancarEtapa(idItem);

        const recipe = vi.mocked(obraApi.util.updateQueryData).mock.calls[0][2];
        const draft = { items: [{ id: 999, ultimaEtapa: 'ideacao' }] }; // ID diferente

        // @ts-ignore
        recipe(draft);

        expect(draft.items[0].ultimaEtapa).toBe('ideacao');
    });
});