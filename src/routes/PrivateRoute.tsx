import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { status } = useAuthContext()

  if (status === 'checking') return <div>Loading...</div>
  if (status === 'not-authenticated') return <Navigate to="/login" replace />

  return <Outlet />
}