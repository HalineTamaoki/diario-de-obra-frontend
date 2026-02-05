import type { CadastroNome, NomeId } from '../types/Common';
import { baseApi } from './api';

export const obraApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cadastrarObra: builder.mutation<NomeId, CadastroNome>({
            query: (obra) => ({
                url: '/obra',
                method: 'POST',
                body: obra,
            }),
            extraOptions: { shoudCheckAuth: true },
            invalidatesTags: ['Obras']
        }),
   }),
});

export const { useCadastrarObraMutation } = obraApi;