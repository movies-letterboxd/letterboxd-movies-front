import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import MoviesGrid from '../components/movies/MoviesGrid'
import type { Movie } from '../types/Movie'

const mk = (over: Partial<Movie> = {}): Movie => ({
  id: 1,
  titulo: 'A',
  sinopsis: 's',
  duracionMinutos: 10,
  fechaEstreno: '2020-01-01',
  poster: '',
  activa: true,
  director: { id: 1, nombre: 'D', imagen: '' },
  generos: [],
  plataformas: [],
  elenco: [],
  ...over,
})

describe('MoviesGrid', () => {
  it('renders skeletons when loading', () => {
    render(
      <MemoryRouter>
        <MoviesGrid movies={[]} isLoading handleDeleteMovie={() => {}} />
      </MemoryRouter>
    )
    // Should render 8 skeleton articles
    const skeletons = screen.getAllByRole('article')
    expect(skeletons).toHaveLength(8)
  })

  it('renders only active movies by default', () => {
    render(
      <MemoryRouter>
        <MoviesGrid movies={[mk({ id: 1, activa: true }), mk({ id: 2, activa: false })]} handleDeleteMovie={() => {}} />
      </MemoryRouter>
    )
    const cards = screen.getAllByLabelText(/Película:/)
    expect(cards).toHaveLength(1)
  })

  it('renders inactive cards when isInactivePage', () => {
    render(
      <MemoryRouter>
        <MoviesGrid movies={[mk({ id: 1, activa: false })]} isInactivePage handleDeleteMovie={() => {}} />
      </MemoryRouter>
    )
    const cards = screen.getAllByLabelText(/Película:/)
    expect(cards).toHaveLength(1)
  })
})
