import type { IdObraIdItem } from '../types/DetalhesObra';
import type { Execucao, ExecucaoResponse, NovaData, OutraData, Previsao } from '../types/Execucao';
import { baseApi } from './api';
import { obraApi } from './obraApi';

export const execucaoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterExecucao: builder.query<Execucao, IdObraIdItem>({
            query: ({ idItem }) => ({
                url: `/execucao/${idItem}`,
                method: 'GET',
            }),
            transformResponse: (response: ExecucaoResponse): Execucao => {
                return {
                    ...response,
                    previsao: { inicio: response?.inicio, termino: response?.termino }
                };
            },
            async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
                try {
                    const { data: execData } = await queryFulfilled;
                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === idItem);
                            if (item) {
                                item.execucao = execData;
                            }
                        })
                    );
                } catch {}
            },
        }),
        addOutraData: builder.mutation<OutraData, NovaData>({
            query: ({ idItem, ...body }) => ({
                url: `/execucao/${idItem}`,
                method: 'POST',
                body,
            }),
            async onQueryStarted({ idObra, idItem }, { dispatch, queryFulfilled }) {
                try {
                    const { data: novaData } = await queryFulfilled;
                    
                    dispatch(
                        execucaoApi.util.updateQueryData('obterExecucao', { idObra, idItem }, (draft) => {
                            if (!draft.datasAdicionais) draft.datasAdicionais = [];
                            draft.datasAdicionais.push(novaData);
                        })
                    );
                    dispatch(
                        obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                            const item = draft.items.find(i => i.id === idItem);
                            if (item?.execucao) {
                                if (!item.execucao.datasAdicionais) item.execucao.datasAdicionais = [];
                                item.execucao.datasAdicionais.push(novaData);
                            }
                        })
                    );
                } catch {}
            },
        }),

        editarPrevisao: builder.mutation<void, Previsao & IdObraIdItem>({
            query: ({ idItem, ...body }) => ({
                url: `/execucao/${idItem}`,
                method: 'PUT',
                body,
            }),
            async onQueryStarted({ idObra, idItem, inicio, termino }, { dispatch, queryFulfilled }) {
                const updateCache = (draft: any, isObraCache: boolean) => {
                    if (isObraCache) {
                        const item = draft.items.find((i: any) => i.id === idItem);
                        if (item?.execucao) item.execucao.previsao = { inicio, termino };
                    } else {
                        draft.inicio = inicio;
                        draft.termino = termino;
                    }
                };

                const patchExec = dispatch(execucaoApi.util.updateQueryData('obterExecucao', { idObra, idItem }, d => updateCache(d, false)));
                const patchObra = dispatch(obraApi.util.updateQueryData('obterObraDetalhada', idObra, d => updateCache(d, true)));
                
                queryFulfilled.catch(() => {
                    patchExec.undo();
                    patchObra.undo();
                });
            },
        }),
        editarComentarioExecucao: builder.mutation<void, IdObraIdItem & { comentario: string }>({
            query: ({ idItem, comentario }) => ({
                url: `/execucao/${idItem}`,
                method: 'PUT',
                body: { comentario },
            }),
            async onQueryStarted({ idObra, idItem, comentario }, { dispatch, queryFulfilled }) {
                const patchExec = dispatch(
                    execucaoApi.util.updateQueryData('obterExecucao', { idObra, idItem }, (draft) => {
                        draft.comentarios = comentario;
                    })
                );
                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item?.execucao) item.execucao.comentarios = comentario;
                    })
                );
                queryFulfilled.catch(() => { patchExec.undo(); patchObra.undo(); });
            },
        }),
        editarOutraData: builder.mutation<void, NovaData & {id: number}>({
            query: ({ id, ...body }) => ({ 
                url: `/execucao/data-adicional/${id}`, 
                method: 'PUT', 
                body
            }),
            async onQueryStarted({ idObra, idItem, id, data }, { dispatch, queryFulfilled }) {
                const patchExec = dispatch(
                    execucaoApi.util.updateQueryData('obterExecucao', { idObra, idItem }, (draft) => {
                        const outraData = draft.datasAdicionais?.find(d => d.id === id);
                        if (outraData) {
                            outraData.data = data;
                        }
                    })
                );

                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item?.execucao?.datasAdicionais) {
                            const outraData = item.execucao.datasAdicionais.find(d => d.id === id);
                            if (outraData) {
                                outraData.data = data;
                            }
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchExec.undo();
                    patchObra.undo();
                }
            },
        }),
        removerOutraData: builder.mutation<void, IdObraIdItem & { id: number }>({
            query: ({ id }) => ({ 
                url: `/execucao/${id}`, 
                method: 'DELETE' 
            }),
            async onQueryStarted({ idObra, idItem, id }, { dispatch, queryFulfilled }) {
                const patchExec = dispatch(
                    execucaoApi.util.updateQueryData('obterExecucao', { idObra, idItem }, (draft) => {
                        draft.datasAdicionais = draft.datasAdicionais?.filter(d => d.id !== id);
                    })
                );
                const patchObra = dispatch(
                    obraApi.util.updateQueryData('obterObraDetalhada', idObra, (draft) => {
                        const item = draft.items.find(i => i.id === idItem);
                        if (item?.execucao?.datasAdicionais) {
                        item.execucao.datasAdicionais = item.execucao.datasAdicionais.filter(d => d.id !== id);
                        }
                    })
                );
                queryFulfilled.catch(() => { patchExec.undo(); patchObra.undo(); });
            },
        }),
    }),
});

export const {
    useObterExecucaoQuery,
    useAddOutraDataMutation,
    useEditarPrevisaoMutation,
    useEditarComentarioExecucaoMutation,
    useEditarOutraDataMutation,
    useRemoverOutraDataMutation
} = execucaoApi;