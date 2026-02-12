import type { IdObraIdItem, IdObraIdItemId } from '../types/DetalhesObra';
import type { NovoOrcamentoType, OrcamentoDetalhesType, OrcamentoResumo } from '../types/Orcamento';
import { baseApi } from './api';
import { obraApi } from './obraApi';

export const orcamentoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterTodosOrcamentos: builder.query<OrcamentoResumo[], IdObraIdItem>({
        query: ({ idItem }) => ({
            url: `/orcamento/${idItem}`,
            method: 'GET',
        }),
        async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
            try {
                const { data: listaOrcamentos } = await queryFulfilled;
                dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item) {
                            item.orcamento = listaOrcamentos;
                        }
                    })
                );
            } catch {}
        },
        }),
        obterOrcamentoDetalhes: builder.query<OrcamentoDetalhesType, { id: number }>({
            query: ({ id }) => ({
                url: `/orcamento/detalhes/${id}`,
                method: 'GET',
            }),
        }),
        addOrcamento: builder.mutation<OrcamentoResumo, NovoOrcamentoType & { idObra: number }>({
            query: ({ idObra, idItem, ...body }) => ({
                url: `/orcamento/${idItem}`,
                method: 'POST',
                body,
            }),
            async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novoOrcamento } = await queryFulfilled;
                    
                    dispatch(
                        orcamentoApi.util.updateQueryData('obterTodosOrcamentos', { idObra, idItem }, (draft) => {
                            draft.push(novoOrcamento);
                        })
                    );

                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === idItem);
                            if (item) {
                                if (!item.orcamento) item.orcamento = [];
                                item.orcamento.push(novoOrcamento);
                            }
                        })
                    );
                } catch {}
            },
        }),

        selecionarOrcamento: builder.mutation<void, IdObraIdItemId & {selecionado: boolean}>({
            query: ({ id, selecionado }) => ({
                url: `/orcamento/${id}/selecionar`,
                method: 'POST',
                body: { selecionado },
            }),
            async onQueryStarted({ id, idItem, idObra }, { dispatch, queryFulfilled }) {
                const updateSelection = (draft: OrcamentoResumo[]) => {
                    draft.forEach(orc => {
                        orc.selecionado = orc.id === id;
                    });
                };

                const patchLista = dispatch(orcamentoApi.util.updateQueryData('obterTodosOrcamentos', { idObra, idItem }, updateSelection));
                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item?.orcamento) updateSelection(item.orcamento);
                    })
                );

                queryFulfilled.catch(() => {
                    patchLista.undo();
                    patchObra.undo();
                });
            },
        }),

        editarOrcamento: builder.mutation<OrcamentoResumo, NovoOrcamentoType & IdObraIdItemId>({
            query: (body) => ({
                url: `/orcamento`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ id, idItem, idObra }, { dispatch, queryFulfilled }) {
                try {
                    const { data: orcamentoAtualizado } = await queryFulfilled;

                    dispatch(
                        orcamentoApi.util.updateQueryData('obterTodosOrcamentos', { idObra, idItem }, (draft) => {
                        const index = draft.findIndex(orc => orc.id === id);
                        if (index !== -1) {
                            draft[index] = orcamentoAtualizado; 
                        }
                        })
                    );

                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === idItem);
                            if (item?.orcamento) {
                                const index = item.orcamento.findIndex(orc => orc.id === id);
                                if (index !== -1) {
                                    item.orcamento[index] = orcamentoAtualizado; 
                                }
                            }
                        })
                    );
                } catch {
                }
            },
            }),

        deletarOrcamento: builder.mutation<void, IdObraIdItemId>({
            query: ({ id }) => ({
                url: `/orcamento/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ id, idItem, idObra }, { dispatch, queryFulfilled }) {
                const filterFn = (draft: OrcamentoResumo[]) => draft.filter(orc => orc.id !== id);

                const patchLista = dispatch(orcamentoApi.util.updateQueryData('obterTodosOrcamentos', { idObra, idItem }, filterFn));
                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item?.orcamento) item.orcamento = filterFn(item.orcamento);
                    })
                );

                queryFulfilled.catch(() => {
                    patchLista.undo();
                    patchObra.undo();
                });
            },
        }),
    }),
});

export const {
    useObterTodosOrcamentosQuery,
    useObterOrcamentoDetalhesQuery,
    useAddOrcamentoMutation,
    useSelecionarOrcamentoMutation,
    useEditarOrcamentoMutation,
    useDeletarOrcamentoMutation,
} = orcamentoApi;