import type { Ideia, NovaIdeia } from '../types/Ideia';
import { baseApi } from './api';
import { obraApi } from './obraApi';

export const ideacaoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterIdeiasByItem: builder.query<Ideia[], { idObra: number; idItem: number }>({
            query: ({ idItem }) => ({
                url: `/ideacao/${idItem}`,
                method: 'GET',
            }),
            async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
                try {
                const { data: listaIdeias } = await queryFulfilled;
                
                dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
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
            query: ({ itemidObra, ...body }) => ({
                url: `/ideacao/${itemidObra}`,
                method: 'POST',
                body,
            }),
            async onQueryStarted({ idObra, itemidObra }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novaIdeia } = await queryFulfilled;

                    dispatch(
                        ideacaoApi.util.updateQueryData('obterIdeiasByItem', { idObra, idItem: itemidObra }, (draft) => {
                            draft.push(novaIdeia);
                        })
                    );

                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === itemidObra);
                            if (item) {
                                item.ideacao ??= [];
                                item.ideacao.push(novaIdeia);
                            }
                        })
                    );
                } catch {}
        },
        }),

        removerLink: builder.mutation<void, { idObra: number; idItem: number; id: number }>({
            query: ({ id }) => ({
                url: `/ideacao/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted({ idObra, idItem, id }, { dispatch, queryFulfilled }) {
                const patchLista = dispatch(
                    ideacaoApi.util.updateQueryData('obterIdeiasByItem', { idObra, idItem }, (draft) => {
                        return draft.filter(ideia => ideia.id !== id);
                    })
                );

                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
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