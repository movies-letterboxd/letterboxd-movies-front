import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import MoviesPage from './pages/MoviesPage.tsx'
import MoviePage from './pages/MoviePage.tsx'
import NewMoviePage from './pages/NewMoviePage.tsx'
import { Navigate } from 'react-router'
import Layout from './components/Layout.tsx'
import './tailwind-input.css'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/new-movie" element={<NewMoviePage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
)