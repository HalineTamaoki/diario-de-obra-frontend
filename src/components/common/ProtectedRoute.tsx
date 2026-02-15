import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { RootState } from '../../app/store'
import { isBeforeNow } from '../../utils/DateUtils'

export default function ProtectedRoute() {
    const token = useSelector((s: RootState) => s.auth.token)
    const location = useLocation();

    const isTokenValid = useMemo(() => {
        return !!(token && !isBeforeNow(token.validTo));
    }, [token]);

    if (!isTokenValid && location.pathname !== '/login' && location.pathname !== '/cadastro') {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (isTokenValid && (location.pathname === '/login' || location.pathname === '/cadastro')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}