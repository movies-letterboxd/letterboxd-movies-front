import { describe, it, expect, vi } from 'vitest'

const navigateMock = vi.fn()
vi.mock('react-router', async (orig) => {
  const real: any = await orig()
  return { ...real, useNavigate: () => navigateMock, Link: ({ children }: any) => <a>{children}</a> }
})

import { render, screen, fireEvent } from '@testing-library/react'
import MovieCard from '../components/movies/MovieCard'
import type { Movie } from '../types/Movie'

describe('MovieCard blocking navigation when confirm open', () => {
  it('does not navigate when confirm is open', () => {
    const movie: Movie = { id: 1, titulo: 'T', sinopsis: 's', duracionMinutos: 1, fechaEstreno: '2020-01-01', poster: '', activa: true, director: { id: 1, nombre: 'D', imagen: '' }, generos: [], plataformas: [], elenco: [] }
    render(<MovieCard movie={movie} handleDeleteMovie={() => {}} />)
    const delBtn = screen.getByRole('button')
    fireEvent.click(delBtn)
    fireEvent.click(screen.getByRole('article'))
    expect(navigateMock).not.toHaveBeenCalled()
  })
})

