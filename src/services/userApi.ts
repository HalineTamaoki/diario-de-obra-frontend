import type { CadastroUsuarioResponse, Usuario } from '../types/Usuario';
import { baseApi } from './api';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        cadastrarUsuario: builder.mutation<CadastroUsuarioResponse, Usuario>({
            query: (user) => ({
                url: '/usuario',
                method: 'POST',
                body: user,
            }),
            extraOptions: { shoudCheckAuth: false }
        }),
   }),
});

export const { useCadastrarUsuarioMutation } = userApi;