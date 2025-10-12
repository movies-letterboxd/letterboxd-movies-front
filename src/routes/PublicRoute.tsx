import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export default function PublicRoute() {
  const { status } = useAuthContext()

  if (status === 'checking') return <LoadingPage />
  if (status === 'authenticated') return <Navigate to="/movies" replace />

  return <Outlet />
}