import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "../contexts/AuthContext";
import LoadingPage from "../pages/LoadingPage";

export default function PrivateRoute() {
  const { status } = useAuthContext()

  if (status === 'checking') return <LoadingPage />
  if (status === 'not-authenticated') return <Navigate to="/login" replace />

  return <Outlet />
}