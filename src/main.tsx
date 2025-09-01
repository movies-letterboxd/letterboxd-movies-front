import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import MoviesPage from './pages/MoviesPage.tsx'
import MoviePage from './pages/MoviePage.tsx'
import NewMoviePage from './pages/NewMoviePage.tsx'
import { Navigate } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/movies" element={<MoviesPage />} />
      <Route path="/movies/new" element={<NewMoviePage />} />
      <Route path="/movies/:id" element={<MoviePage />} />
      <Route path="/*" element={<Navigate to="/movies" replace />} />
    </Routes>
  </BrowserRouter>
)