
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { RootState } from '../../app/store'
import { isBeforeNow } from '../../utils/DateUtils'

export default function ProtectedRoute() {
    const token = useSelector((s: RootState) => s.auth.token)
    const location = useLocation()

    if (!token || isBeforeNow(token.validTo)) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return <Outlet />
}
