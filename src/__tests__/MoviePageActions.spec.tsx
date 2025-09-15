import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import MoviePage from '../pages/MoviePage'

const getMovieById = vi.fn(async () => ({ data: { data: {
  id: 9,
  titulo: 'Title', sinopsis: 's', duracionMinutos: 90, fechaEstreno: '2000-01-01', poster: '', activa: true,
  director: { id: 1, nombre: 'D', imagen: '' }, generos: [], plataformas: [], elenco: []
} } }))
const deleteMovieById = vi.fn(async () => ({ success: true }))
const realDeleteMovieById = vi.fn(async () => ({ success: true }))
const activateMovieById = vi.fn(async () => ({ success: true }))

vi.mock('../services/movieService', () => ({
  getMovieById,
  deleteMovieById,
  realDeleteMovieById,
  activateMovieById,
}))

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() }, success: vi.fn(), error: vi.fn() }))

describe('MoviePage actions', () => {
  it('deactivates, then activates, then deletes when inactive', async () => {
    render(
      <MemoryRouter initialEntries={["/movies/9"]}>
        <Routes>
          <Route path="/movies" element={<div>Listado</div>} />
          <Route path="/movies/:id" element={<MoviePage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => expect(screen.getByText('Title')).toBeInTheDocument())

    // Open deactivate confirm
    const dangerBtn = screen.getByRole('button')
    fireEvent.click(dangerBtn)
    const confirmDeactivate = await screen.findByRole('button', { name: 'Desactivar' })
    fireEvent.click(confirmDeactivate)
    await waitFor(() => expect(deleteMovieById).toHaveBeenCalled())

    // Now movie should be inactive, an activate button appears
    const activateBtn = await screen.findByRole('button')
    fireEvent.click(activateBtn)
    const confirmActivate = await screen.findByRole('button', { name: 'Activar' })
    fireEvent.click(confirmActivate)
    await waitFor(() => expect(activateMovieById).toHaveBeenCalled())

    // Simulate inactive state then delete permanently
    getMovieById.mockResolvedValueOnce({ data: { data: {
      id: 9,
      titulo: 'Title', sinopsis: 's', duracionMinutos: 90, fechaEstreno: '2000-01-01', poster: '', activa: false,
      director: { id: 1, nombre: 'D', imagen: '' }, generos: [], plataformas: [], elenco: []
    } } })

    // open delete confirm and confirm deletion
    fireEvent.click(dangerBtn)
    const confirmDelete = await screen.findByRole('button', { name: 'Eliminar' })
    fireEvent.click(confirmDelete)
    await waitFor(() => expect(realDeleteMovieById).toHaveBeenCalled())
  })
})

