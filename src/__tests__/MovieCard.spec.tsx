import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MovieCard from '../components/movies/MovieCard'
import type { Movie } from '../types/Movie'

const navigateMock = vi.fn()
vi.mock('react-router', async (orig) => {
  const real: any = await orig()
  return { ...real, useNavigate: () => navigateMock, Link: ({ children }: any) => <a>{children}</a> }
})

vi.mock('../../services/movieService', () => ({
  deleteMovieById: vi.fn(async () => ({ success: true })),
}))

vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() }, success: vi.fn(), error: vi.fn() }))

const movie: Movie = {
  id: 1,
  titulo: 'Matrix',
  sinopsis: 's',
  duracionMinutos: 10,
  fechaEstreno: '2020-01-01',
  poster: '',
  activa: true,
  director: { id: 1, nombre: 'D', imagen: '' },
  generos: [],
  plataformas: [],
  elenco: [],
}

describe('MovieCard', () => {
  beforeEach(() => {
    navigateMock.mockReset()
  })

  it('navigates on click', () => {
    render(<MovieCard movie={movie} handleDeleteMovie={() => {}} />)
    const article = screen.getByRole('article')
    fireEvent.click(article)
    expect(navigateMock).toHaveBeenCalledWith('/movies/1')
  })

  it('opens confirm dialog and deletes', async () => {
    const onDelete = vi.fn()
    render(<MovieCard movie={movie} handleDeleteMovie={onDelete} />)
    const delBtn = screen.getByRole('button') // first button is delete
    fireEvent.click(delBtn)
    // Confirm dialog should render confirm button with default text "Desactivar"
    const confirm = await screen.findByRole('button', { name: 'Desactivar' })
    fireEvent.click(confirm)
    // handler should be called after service resolves
    // give microtask time
    await Promise.resolve()
    expect(onDelete).toHaveBeenCalledWith(1)
  })
})
