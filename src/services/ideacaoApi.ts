import type { Ideia, NovaIdeia } from '../types/Ideia';
import { baseApi } from './api';
import { obraApi } from './obraApi';

export const ideacaoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterIdeiasByItem: builder.query<Ideia[], { obraId: number; idItem: number }>({
            query: ({ idItem }) => ({
                url: `/ideacao/${idItem}`,
                method: 'GET',
            }),
            async onQueryStarted({ obraId, idItem }, { dispatch, queryFulfilled }) {
                try {
                const { data: listaIdeias } = await queryFulfilled;
                
                dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item) {
                            item.ideacao = listaIdeias;
                        }
                    })
                );
                } catch {}
            },
        }),

        addLink: builder.mutation<Ideia, NovaIdeia>({
            query: ({ itemObraId, ...body }) => ({
                url: `/ideacao/${itemObraId}`,
                method: 'POST',
                body,
            }),
            async onQueryStarted({ obraId, itemObraId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novaIdeia } = await queryFulfilled;

                    dispatch(
                        ideacaoApi.util.updateQueryData('obterIdeiasByItem', { obraId, idItem: itemObraId }, (draft) => {
                            draft.push(novaIdeia);
                        })
                    );

                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                            const item = draft.items.find(i => i.id === itemObraId);
                            if (item) {
                                item.ideacao ??= [];
                                item.ideacao.push(novaIdeia);
                            }
                        })
                    );
                } catch {}
        },
        }),

        removerLink: builder.mutation<void, { obraId: number; idItem: number; id: number }>({
            query: ({ id }) => ({
                url: `/ideacao/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ obraId, idItem, id }, { dispatch, queryFulfilled }) {
                const patchLista = dispatch(
                    ideacaoApi.util.updateQueryData('obterIdeiasByItem', { obraId, idItem }, (draft) => {
                        return draft.filter(ideia => ideia.id !== id);
                    })
                );

                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', obraId, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item && item.ideacao) {
                            item.ideacao = item.ideacao.filter(ideia => ideia.id !== id);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchLista.undo();
                    patchObra.undo();
                }
            },
        }),
    }),
});

export const { 
    useObterIdeiasByItemQuery, 
    useAddLinkMutation, 
    useRemoverLinkMutation 
} = ideacaoApi;