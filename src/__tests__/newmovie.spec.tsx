import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import NewMoviePage from '../pages/NewMoviePage'

vi.mock('../services/apiClient', () => {
  const api = {
    get: vi.fn(async (url: string) => {
      if (url === '/generos') return { data: { data: [] } }
      if (url === '/plataformas') return { data: { data: [] } }
      if (url === '/personas/actores') return { data: [] }
      if (url === '/personas/directores') return { data: [{ id: 1, nombre: 'Dir Uno' }] }
      return { data: { data: [] } }
    }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() } },
  }
  return { default: api, BASE_URL: 'https://example.test' }
})

vi.mock('../services/movieService', () => ({
  createMovie: vi.fn(async () => ({ success: true, data: { data: { id: 99 } } })),
}))

describe('NewMoviePage', () => {
  beforeEach(() => {
    // reset mocks if needed
  })

  it('enables submit when form is valid and submits', async () => {
    render(
      <MemoryRouter initialEntries={["/new-movie"]}>
        <Routes>
          <Route path="/new-movie" element={<NewMoviePage />} />
          <Route path="/movies/:id" element={<div>Detalle</div>} />
        </Routes>
      </MemoryRouter>
    )

    // Fill required inputs
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Title' } })
    fireEvent.change(screen.getByLabelText('Duración'), { target: { value: '123' } })
    fireEvent.change(screen.getByLabelText('Fecha estreno'), { target: { value: '2020-01-01' } })
    fireEvent.change(screen.getByLabelText('Sinopsis'), { target: { value: 'Desc' } })

    // Select director via SelectWithSearch
    const directorInput = screen.getByPlaceholderText('Seleccionar director') as HTMLInputElement
    fireEvent.focus(directorInput)
    fireEvent.change(directorInput, { target: { value: 'Dir' } })
    // The option should appear from provided options
    const opt = await screen.findByText('Dir Uno')
    fireEvent.mouseDown(opt)

    const submit = screen.getByRole('button', { name: 'Guardar' })
    await waitFor(() => expect(submit).not.toBeDisabled())
    fireEvent.click(submit)

    // navigate to detail page
    await waitFor(() => expect(screen.getByText('Detalle')).toBeInTheDocument())
  })
})

