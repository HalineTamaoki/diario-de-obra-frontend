import type { CadastroNome, NomeId } from '../types/Common';
import { EtapaMap } from '../types/DetalhesObra';
import type { Obra, ObraDetalhada } from '../types/Obra';
import { baseApi } from './api';

export const obraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        obterObras: builder.query<Obra[], void>({
            query: () => ({
                url: '/obra',
                method: 'GET'
            }),
            extraOptions: { shoudCheckAuth: true }
        }),
        obterObraDetalhada: builder.query<ObraDetalhada, number>({
            query: (id) => ({ url: `/obra/${id}`, method: 'GET' }),
            transformResponse: (response: any): ObraDetalhada => {
                return {
                    ...response,
                    items: response.items.map((item: any) => ({
                        ...item,
                        ultimaEtapa: EtapaMap[item.ultimaEtapa as number] || 'ideacao'
                    }))
                };
            }
        }),
        cadastrarObra: builder.mutation<NomeId, CadastroNome>({
            query: (obra) => ({
                url: '/obra',
                method: 'POST',
                body: obra,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data: novaObra } = await queryFulfilled;
                    dispatch(
                        obraApi.util.updateQueryData('obterObras', undefined, (draft) => {
                            draft.push({ ...novaObra, porcentagem: 0 });
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
        deletarObra: builder.mutation<void, number>({
            query: (id) => ({
                url: `/obra/${id}`,
                method: 'DELETE',
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    obraApi.util.updateQueryData('obterObras', undefined, (draft) => {
                        return draft.filter(obra => obra.id !== id);
                    })
                );
                queryFulfilled.catch(patchResult.undo);
            },
        })
   }),
});

export const { useCadastrarObraMutation, useObterObrasQuery, useObterObraDetalhadaQuery, useEditarObraMutation, 
    useDeletarObraMutation } = obraApi;