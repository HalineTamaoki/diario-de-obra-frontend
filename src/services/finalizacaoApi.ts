import type { IdObraIdItem } from '../types/DetalhesObra';
import type { Finalizacao } from '../types/Finalizacao';
import { baseApi } from './api';
import { obraApi } from './obraApi';

export const finalizacaoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterFinalizacao: builder.query<Finalizacao, IdObraIdItem>({
            query: ({ idItem }) => ({
                url: `/finalizacao/${idItem}`,
                method: 'GET',
            }),
            async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
                try {
                    const { data: finalizacaoData } = await queryFulfilled;
                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === idItem);
                            if (item) {
                                item.finalizacao = finalizacaoData;
                            }
                        })
                    );
                } catch {}
            },
        }),
        editarDataFinalizacao: builder.mutation<Finalizacao, IdObraIdItem & { data: string }>({
            query: ({ idItem, data }) => ({
                url: `/finalizacao/data/${idItem}`,
                method: 'PATCH',
                body: { data },
            }),
            async onQueryStarted({ idItem, idObra }, { dispatch, queryFulfilled }) {
                const { data: finalizacaoData } = await queryFulfilled;
                const patchLocal = dispatch(
                    finalizacaoApi.util.updateQueryData('obterFinalizacao', { idObra, idItem }, (draft) => {
                        Object.assign(draft, finalizacaoData);
                    })
                );

                const patchGlobal = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item) {
                            if (!item.finalizacao) item.finalizacao = finalizacaoData;
                            else Object.assign(item.finalizacao, finalizacaoData);
                        }
                    })
                );

                queryFulfilled.catch(() => {
                    patchLocal.undo();
                    patchGlobal.undo();
                });
            },
        }),

        editarComentarioFinalizacao: builder.mutation<Finalizacao, IdObraIdItem & { comentarios: string }>({
            query: ({ idItem, comentarios }) => ({
                url: `/finalizacao/${idItem}`,
                method: 'PATCH',
                body: { comentarios },
            }),
            async onQueryStarted({ idItem, idObra }, { dispatch, queryFulfilled }) {
                const { data: finalizacaoData } = await queryFulfilled;
                const patchLocal = dispatch(
                    finalizacaoApi.util.updateQueryData('obterFinalizacao', { idObra, idItem }, (draft) => {
                        Object.assign(draft, finalizacaoData);
                    })
                );

                const patchGlobal = dispatch(
                obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item) {
                            if (!item.finalizacao) item.finalizacao = finalizacaoData;
                            else Object.assign(item.finalizacao, finalizacaoData);
                        }
                    })
                );

                queryFulfilled.catch(() => {
                    patchLocal.undo();
                    patchGlobal.undo();
                });
            },
        }),
        marcarFinalizado: builder.mutation<Finalizacao, IdObraIdItem & { selecionado: boolean }>({
            query: ({ idItem, selecionado }) => ({
                url: `/finalizacao/${idItem}`,
                method: 'POST',
                body: { selecionado },
            }),
            async onQueryStarted({ idItem, idObra }, { dispatch, queryFulfilled }) {
                const { data: finalizacaoData } = await queryFulfilled;
                const patchLocal = dispatch(
                    finalizacaoApi.util.updateQueryData('obterFinalizacao', { idObra, idItem }, (draft) => {
                        Object.assign(draft, finalizacaoData);
                    })
                );

                const patchGlobal = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item) {
                            if (!item.finalizacao) item.finalizacao = finalizacaoData;
                            else Object.assign(item.finalizacao, finalizacaoData);
                        }
                    })
                );

                queryFulfilled.catch(() => {
                    patchLocal.undo();
                    patchGlobal.undo();
                });
            },
        }),
    }),
});

export const {
    useObterFinalizacaoQuery,
    useEditarDataFinalizacaoMutation,
    useEditarComentarioFinalizacaoMutation,
    useMarcarFinalizadoMutation
} = finalizacaoApi;