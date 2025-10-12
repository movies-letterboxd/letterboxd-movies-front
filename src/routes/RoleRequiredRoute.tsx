import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import { hasPermission } from "../utils/permissions";

interface RoleRequiredRouteProps {
  requiredRoles: string[]
  fallbackRoute?: string
}

export default function RoleRequiredRoute({ requiredRoles, fallbackRoute = '/movies' }: RoleRequiredRouteProps) {
  const { permissions } = useAuthContext()

  if (!requiredRoles.some(role => hasPermission(permissions, role))) return <Navigate to={fallbackRoute} replace />
  
  return <Outlet />
}