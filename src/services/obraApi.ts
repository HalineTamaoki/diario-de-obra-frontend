import type { CadastroNome, NomeId } from '../types/Common';
import type { Obra } from '../types/Obra';
import { baseApi } from './api';

export const obraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cadastrarObra: builder.mutation<NomeId, CadastroNome>({
            query: (obra) => ({
                url: '/obra',
                method: 'POST',
                body: obra,
            }),
            extraOptions: { shoudCheckAuth: true }
        }),
        obterObras: builder.query<Obra[], void>({
            query: () => ({
                url: '/obra',
                method: 'GET'
            }),
            extraOptions: { shoudCheckAuth: true }
        }),
        editarObra: builder.mutation<NomeId, NomeId>({
            query: (obra) => ({
                url: '/obra',
                method: 'PUT',
                body: obra,
            }),
            extraOptions: { shoudCheckAuth: true }
        }),
        deletarObra: builder.mutation<void, number>({
            query: (id) => ({
                url: `/obra/${id}`,
                method: 'DELETE',
            }),
            extraOptions: { shoudCheckAuth: true }
        })
   }),
});

export const { useCadastrarObraMutation, useObterObrasQuery, useEditarObraMutation, useDeletarObraMutation } = obraApi;