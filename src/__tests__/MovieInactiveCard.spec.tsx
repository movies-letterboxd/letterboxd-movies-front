import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MovieInactiveCard from '../components/movies/MovieInactiveCard'
import type { Movie } from '../types/Movie'

const navigateMock = vi.fn()
vi.mock('react-router', async (orig) => {
  const real: any = await orig()
  return { ...real, useNavigate: () => navigateMock, Link: ({ children }: any) => <a>{children}</a> }
})

const realDelete = vi.fn(async () => ({ success: true }))
const activate = vi.fn(async () => ({ success: true }))
vi.mock('../../services/movieService', () => ({
  realDeleteMovieById: realDelete,
  activateMovieById: activate,
}))

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() }, success: vi.fn(), error: vi.fn() }))

const movie: Movie = {
  id: 2,
  titulo: 'Inception',
  sinopsis: 's',
  duracionMinutos: 10,
  fechaEstreno: '2020-01-01',
  poster: '',
  activa: false,
  director: { id: 1, nombre: 'D', imagen: '' },
  generos: [],
  plataformas: [],
  elenco: [],
}

describe('MovieInactiveCard', () => {
  beforeEach(() => {
    navigateMock.mockReset()
    realDelete.mockClear()
    activate.mockClear()
  })

  it('opens activate dialog and activates', async () => {
    const onChange = vi.fn()
    render(<MovieInactiveCard movie={movie} handleDeleteMovie={onChange} />)
    const activateBtn = screen.getByRole('button') // first button is activate
    fireEvent.click(activateBtn)
    const confirm = await screen.findByRole('button', { name: 'Activar' })
    fireEvent.click(confirm)
    await Promise.resolve()
    expect(activate).toHaveBeenCalledWith(2)
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('opens delete dialog and deletes', async () => {
    const onChange = vi.fn()
    render(<MovieInactiveCard movie={movie} handleDeleteMovie={onChange} />)
    const buttons = screen.getAllByRole('button')
    const deleteBtn = buttons[1] // second button is delete
    fireEvent.click(deleteBtn)
    const confirm = await screen.findByRole('button', { name: 'Eliminar' })
    fireEvent.click(confirm)
    await Promise.resolve()
    expect(realDelete).toHaveBeenCalledWith(2)
    expect(onChange).toHaveBeenCalledWith(2)
  })
})
