import type { NomeId } from '../types/Common';
import { obraApi } from './obraApi';
import { baseApi } from './api';

export const itemObraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cadastrarItem: builder.mutation<NomeId, { obraId: number; nome: string }>({
            query: ({ obraId, ...body }) => ({ url: `/item/${obraId}`, method: 'POST', body }),
            async onQueryStarted({ obraId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novoItem } = await queryFulfilled;
                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                            draft.items.push({ ...novoItem, ultimaEtapa: 'ideacao' });
                        })
                    );
                } catch {}
            },
        }),
        editarObra: builder.mutation<NomeId, NomeId>({
            query: (obra) => ({
                url: '/obra',
                method: 'PUT',
                body: obra,
            }),
            async onQueryStarted({ id, nome }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObras', undefined, (draft) => {
                        const obra = draft.find(o => o.id === id);
                        if (obra) obra.nome = nome;
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        }),
        editarItem: builder.mutation<NomeId, NomeId & { obraId: number }>({
            query: ({ id, nome }) => ({
                url: '/item',
                method: 'PUT',
                body: { id, nome },
            }),
            extraOptions: { shoudCheckAuth: true },
            async onQueryStarted({ id, obraId, nome }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                        const item = draft.items.find(i => i.id === id);
                        if (item) {
                            item.nome = nome;
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deletarItem: builder.mutation<void, { id: number; obraId: number }>({
            query: ({ id }) => ({ url: `/item/${id}`, method: 'DELETE' }),
            async onQueryStarted({ id, obraId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                        draft.items = draft.items.filter(item => item.id !== id);
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        }),
    }),
});

export const { useCadastrarItemMutation, useDeletarItemMutation } = itemObraApi;