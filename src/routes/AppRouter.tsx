import { Navigate, Route, Routes } from "react-router";
import LoginPage from "../pages/LoginPage";
import Layout from "../components/Layout";
import MoviesPage from "../pages/MoviesPage";
import NewMoviePage from "../pages/NewMoviePage";
import InactiveMoviesPage from "../pages/InactiveMoviesPage";
import MoviePage from "../pages/MoviePage";
import EditMoviePage from "../pages/EditMoviePage";
import AttributesPage from "../pages/AttributesPage";
import PlatformsPage from "../pages/PlatformsPage";
import GenresPage from "../pages/GenresPage";
import DirectorsPage from "../pages/DirectorsPage";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RoleRequiredRoute from "./RoleRequiredRoute";
import { availablePermissions } from "../utils/permissions";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/movies" element={<MoviesPage />} />

          <Route element={<RoleRequiredRoute requiredRoles={[availablePermissions.CREATE_MOVIE]} />}>
            <Route path="/new-movie" element={<NewMoviePage />} />
          </Route>

          <Route element={<RoleRequiredRoute requiredRoles={[availablePermissions.CREATE_MOVIE]} />}>
            <Route path="/movies/inactives" element={<InactiveMoviesPage />} />
          </Route>

          <Route path="/movies/:id" element={<MoviePage />} />

          <Route element={<RoleRequiredRoute requiredRoles={[availablePermissions.EDIT_MOVIE]} />}>
            <Route path="/movies/:id/edit" element={<EditMoviePage />} />
          </Route>

          <Route element={<RoleRequiredRoute requiredRoles={[availablePermissions.CREATE_MOVIE, availablePermissions.EDIT_MOVIE, availablePermissions.DELETE_MOVIE]} />}>
            <Route path="/attributes" element={<AttributesPage />}>
              <Route index element={<Navigate to="platforms" replace />} />
              <Route path="platforms" element={<PlatformsPage />} />
              <Route path="genres" element={<GenresPage />} />
              <Route path="directors" element={<DirectorsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route path="/*" element={<Navigate to="/movies" replace />} />
    </Routes>
  )
}