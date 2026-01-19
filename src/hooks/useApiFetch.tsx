import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { mostrarNotificacao } from "../features/notificacaoSlice";
import { isBeforeNow } from "../utils/DateUtils";
import type { RootState } from "../app/store";

type ApiFetch = <T>(url: string, options?: RequestInit) => Promise<T  | undefined>;

export function useApiFetch(): ApiFetch {
    const token = useSelector((s: RootState) => s.auth.token);
    const dispatch = useDispatch();

    const handleLogout = useCallback(() => {
        dispatch(logout());
    }, []);

    const apiFetchWithToken = useCallback(async <T,>(url: string, options: RequestInit = {}) => {
        if(!token){
            handleLogout();
            return;
        }

        if(isBeforeNow(token.validTo)){
            dispatch(mostrarNotificacao({variant: 'warning', mensagem: 'Seu login expirou. Faça o login novamente.'}));
            handleLogout();
            return;
        }
        
        const headers = new Headers(options.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');

        const res = await fetch(url, { ...options, headers });
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            const error = new Error(text || res.statusText) as Error & { status?: number };
            error.status = res.status;

            if(error.status === 401){
                handleLogout();
            }
            throw error;
        }
        return res.json() as Promise<T>;
    }, [token]);

    return apiFetchWithToken;
}
