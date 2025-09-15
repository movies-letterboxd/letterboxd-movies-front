import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import MoviesPage from '../pages/MoviesPage'
import InactiveMoviesPage from '../pages/InactiveMoviesPage'
import MoviePage from '../pages/MoviePage'

vi.mock('../services/movieService', () => ({
  getAllMovies: vi.fn(async () => ({ success: true, data: { data: [
    { id: 1, titulo: 'Matrix', sinopsis: 's', duracionMinutos: 100, fechaEstreno: '1999-01-01', poster: '', activa: true, director: { id: 1, nombre: 'D', imagen: '' }, generos: [], plataformas: [], elenco: [] },
    { id: 2, titulo: 'Inception', sinopsis: 's', duracionMinutos: 120, fechaEstreno: '2010-01-01', poster: '', activa: true, director: { id: 2, nombre: 'N', imagen: '' }, generos: [], plataformas: [], elenco: [] },
  ] } })),
  getAllInactiveMovies: vi.fn(async () => ({ success: true, data: [
    { id: 3, titulo: 'Off', sinopsis: 's', duracionMinutos: 90, fechaEstreno: '2000-01-01', poster: '', activa: false, director: { id: 3, nombre: 'X', imagen: '' }, generos: [], plataformas: [], elenco: [] },
  ] })),
  getMovieById: vi.fn(async (id: number) => ({ data: { data: { id, titulo: 'Title', sinopsis: 's', duracionMinutos: 90, fechaEstreno: '2000-01-01', poster: '', activa: true, director: { id: 1, nombre: 'D', imagen: '' }, generos: [], plataformas: [], elenco: [] } } })),
  deleteMovieById: vi.fn(async () => ({ success: true })),
  realDeleteMovieById: vi.fn(async () => ({ success: true })),
  activateMovieById: vi.fn(async () => ({ success: true })),
}))

describe('MoviesPage', () => {
  it('loads movies and filters by search', async () => {
    render(
      <MemoryRouter initialEntries={["/movies"]}>
        <Routes>
          <Route path="/movies" element={<MoviesPage />} />
        </Routes>
      </MemoryRouter>
    )
    // wait for two movies
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Película:/)).toHaveLength(2)
    })
    const search = screen.getByPlaceholderText('Buscar película...') as HTMLInputElement
    fireEvent.change(search, { target: { value: 'inception' } })
    // filter should reduce to 1
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Película:/)).toHaveLength(1)
    })
  })
})

describe('InactiveMoviesPage', () => {
  it('loads and renders inactive movies', async () => {
    render(
      <MemoryRouter initialEntries={["/movies/inactives"]}>
        <Routes>
          <Route path="/movies/inactives" element={<InactiveMoviesPage />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getAllByLabelText(/Película:/)).toHaveLength(1)
    })
  })
})

describe('MoviePage', () => {
  it('loads a movie by id and renders details', async () => {
    render(
      <MemoryRouter initialEntries={["/movies/10"]}>
        <Routes>
          <Route path="/movies/:id" element={<MoviePage />} />
        </Routes>
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByText('Title')).toBeInTheDocument()
    })
  })
})

