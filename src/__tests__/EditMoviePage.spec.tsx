import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import EditMoviePage from '../pages/EditMoviePage'

vi.mock('../services/apiClient', () => {
  const api = {
    get: vi.fn(async (url: string) => {
      if (url === '/generos') return { data: { data: [{ id: 10, nombre: 'Drama' }] } }
      if (url === '/plataformas') return { data: { data: [{ id: 20, nombre: 'Netflix' }] } }
      if (url === '/personas/actores') return { data: [{ id: 30, nombre: 'Actor X' }] }
      if (url === '/personas/directores') return { data: [{ id: 40, nombre: 'Dir X' }] }
      return { data: { data: [] } }
    }),
    interceptors: { request: { use: vi.fn() } },
  }
  return { default: api, BASE_URL: 'https://example.test' }
})

vi.mock('../services/movieService', () => ({
  getMovieById: vi.fn(async () => ({ data: { data: {
    id: 5,
    titulo: 'Old', sinopsis: 'S', duracionMinutos: 111, fechaEstreno: '2011-01-01', poster: '', activa: true,
    director: { id: 40, nombre: 'Dir X', imagen: '' },
    generos: [{ id: 10, nombre: 'Drama' }],
    plataformas: [{ id: 20, nombre: 'Netflix' }],
    elenco: [{ personaId: 30, nombrePersona: 'Actor X', personaje: 'Heroe', orden: 1 }]
  } } })),
  updateMovie: vi.fn(async () => ({ success: true, data: { data: { id: 5 } } })),
}))

describe('EditMoviePage', () => {
  beforeEach(() => {
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  it('loads existing data, edits elenco and saves', async () => {
    render(
      <MemoryRouter initialEntries={["/movies/5/edit"]}>
        <Routes>
          <Route path="/movies/:id/edit" element={<EditMoviePage />} />
          <Route path="/movies/:id" element={<div>Volví al detalle</div>} />
        </Routes>
      </MemoryRouter>
    )

    // waits for form fields to populate
    await waitFor(() => {
      expect(screen.getByDisplayValue('Old')).toBeInTheDocument()
    })

    // Add an actor to elenco via SelectWithSearch and rol input
    const elencoSearch = screen.getByPlaceholderText('Seleccionar persona') as HTMLInputElement
    fireEvent.focus(elencoSearch)
    fireEvent.change(elencoSearch, { target: { value: 'Actor' } })
    const opt = await screen.findByText('Actor X')
    fireEvent.mouseDown(opt)
    fireEvent.change(screen.getByLabelText('Rol'), { target: { value: 'Nuevo Rol' } })
    fireEvent.click(screen.getByRole('button', { name: /Agregar|Agregar\/Actualizar/ }))

    // Remove from elenco
    const quitar = await screen.findByRole('button', { name: 'Quitar' })
    fireEvent.click(quitar)

    // Guardar cambios
    const save = screen.getByRole('button', { name: 'Guardar cambios' })
    await waitFor(() => expect(save).not.toBeDisabled())
    fireEvent.click(save)

    await waitFor(() => expect(screen.getByText('Volví al detalle')).toBeInTheDocument())
  })
})

