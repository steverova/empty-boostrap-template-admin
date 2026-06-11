import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../stores/auth-store'

// ProtectedRoute now only checks the auth store flag. The actual
// validation (users/me) runs in Root to avoid duplication and
// potential infinite redirects when landing on public routes.
export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}
