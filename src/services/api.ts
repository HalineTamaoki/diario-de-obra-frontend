import { logout } from "../features/authSlice";
import { mostrarNotificacao } from "../features/notificacaoSlice";
import { isBeforeNow } from "../utils/DateUtils";
import type { RootState } from "../app/store";
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token.access_token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const baseQueryWithInterceptor: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions: { shoudCheckAuth?: boolean } = { shoudCheckAuth: true }
) => {
    if(extraOptions.shoudCheckAuth === false){
        return rawBaseQuery(args, api, extraOptions);
    }
    
    const state = api.getState() as RootState;
    const token = state.auth.token;

    if (!token) {
        api.dispatch(logout());
        return { error: { status: 401, data: 'No token' } as FetchBaseQueryError };
    }

    if (isBeforeNow(token.validTo)) {
        api.dispatch(mostrarNotificacao({ variant: 'warning', mensagem: 'Seu login expirou. Faça o login novamente.' }));
        api.dispatch(logout());
        return { error: { status: 401, data: 'Token expired' } as FetchBaseQueryError };
    }

    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        api.dispatch(logout());
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithInterceptor,
    endpoints: () => ({}),
    tagTypes: ['Usuario'],
});