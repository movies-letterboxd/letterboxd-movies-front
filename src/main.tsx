import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import MoviesPage from './pages/MoviesPage.tsx'
import MoviePage from './pages/MoviePage.tsx'
import NewMoviePage from './pages/NewMoviePage.tsx'
import { Navigate } from 'react-router'
import Layout from './components/Layout.tsx'
import './tailwind-input.css'
import EditMoviePage from './pages/EditMoviePage.tsx'
import { Toaster } from 'react-hot-toast'
import InactiveMoviesPage from './pages/InactiveMoviesPage.tsx'
import AttributesPage from './pages/AttributesPage.tsx'
import PlatformsPage from './pages/PlatformsPage.tsx'
import GenresPage from './pages/GenresPage.tsx'
import DirectorsPage from './pages/DirectorsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster
      position="bottom-right"
      reverseOrder={false}
    />
    
    <Layout>
      <Routes>
        <Route path="/movies" element={<MoviesPage />} />
        <Route path="/new-movie" element={<NewMoviePage />} />
        <Route path="/movies/inactives" element={<InactiveMoviesPage />} />
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/movies/:id/edit" element={<EditMoviePage />} />
        
        <Route path="/attributes" element={<AttributesPage />}>
          <Route index element={<Navigate to="platforms" replace />} />
          <Route path="platforms" element={<PlatformsPage />} />
          <Route path="genres" element={<GenresPage />} />
          <Route path="directors" element={<DirectorsPage />} />
        </Route>

        <Route path="/*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
)