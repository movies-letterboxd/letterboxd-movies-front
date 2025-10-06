import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";

export default function PublicRoute() {
  const { status } = useAuthContext()

  if (status === 'checking') return <div>Loading...</div>
  if (status === 'authenticated') return <Navigate to="/movies" replace />

  return <Outlet />
}