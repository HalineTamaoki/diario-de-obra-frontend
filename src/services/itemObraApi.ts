import type { NomeId } from '../types/Common';
import { obraApi } from './obraApi';
import { baseApi } from './api';

export const itemObraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cadastrarItem: builder.mutation<NomeId, { idObra: number; nome: string }>({
            query: ({ idObra, ...body }) => ({ url: `/item/${idObra}`, method: 'POST', body }),
            async onQueryStarted({ idObra }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novoItem } = await queryFulfilled;
                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
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
        editarItem: builder.mutation<NomeId, NomeId & { idObra: number }>({
            query: ({ id, nome }) => ({
                url: '/item',
                method: 'PUT',
                body: { id, nome },
            }),
            extraOptions: { shoudCheckAuth: true },
            async onQueryStarted({ id, idObra, nome }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
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
        deletarItem: builder.mutation<void, { id: number; idObra: number }>({
            query: ({ id }) => ({ url: `/item/${id}`, method: 'DELETE' }),
            async onQueryStarted({ id, idObra }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        draft.items = draft.items.filter(item => item.id !== id);
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        }),
    }),
});

export const { useCadastrarItemMutation, useDeletarItemMutation, useEditarItemMutation } = itemObraApi;