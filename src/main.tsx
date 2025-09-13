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
        <Route path="/movies/:id" element={<MoviePage />} />
        <Route path="/movies/:id/edit" element={<EditMoviePage />} />
        <Route path="/*" element={<Navigate to="/movies" replace />} />
      </Routes>
    </Layout>
  </BrowserRouter>
)