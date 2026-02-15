import type { Token, Usuario } from '../types/Usuario';
import { baseApi } from './api';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<Token, Usuario>({
            query: (user) => ({
                url: '/auth/login',
                method: 'POST',
                body: user,
            }),
            extraOptions: { shoudCheckAuth: false }
        }),
   }),
});

export const { useLoginMutation } = authApi;