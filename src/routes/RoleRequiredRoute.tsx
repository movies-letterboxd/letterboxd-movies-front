import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { hasPermission } from "../utils/permissions";

interface RoleRequiredRouteProps {
  requiredRoles: string[]
  fallbackRoute?: string
  match?: 'any' | 'all'
}

export default function RoleRequiredRoute({ 
  requiredRoles, 
  fallbackRoute = '/movies',
  match = 'all'
}: RoleRequiredRouteProps) {
  const { permissions, status } = useAuthContext()

  if (status === 'checking') return null

  if (!requiredRoles.length) return <Outlet />

  const isAllowed =
    match === 'all'    
      ? requiredRoles.every(role => hasPermission(permissions, role))
      : requiredRoles.some(role => hasPermission(permissions, role))

  if (!isAllowed) return <Navigate to={fallbackRoute} replace />

  return <Outlet />
}