
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { RootState } from '../../app/store'
import { isBeforeNow } from '../../utils/DateUtils'

export default function ProtectedRoute() {
    const token = useSelector((s: RootState) => s.auth.token)
    const location = useLocation();

    const isTokenValid = token && !isBeforeNow(token.validTo);
    if (!isTokenValid) {
        return <Navigate to="/login" replace state={{ from: location }} />
    } else if(isTokenValid && (location.pathname === '/login' || location.pathname === '/cadastro')) {
        return <Navigate to="/" replace state={{ from: location }} />
    }

    return <Outlet />
}
