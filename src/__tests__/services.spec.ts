import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '../services/apiClient'
import {
  getMovieById,
  getAllMovies,
  getAllInactiveMovies,
  deleteMovieById,
  realDeleteMovieById,
  createMovie,
  updateMovie,
  activateMovieById,
  type MoviePayload,
} from '../services/movieService'
import { createPerson } from '../services/peopleService'

vi.mock('../services/apiClient', () => {
  const api = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: { request: { use: vi.fn() } },
  }
  return { default: api, BASE_URL: 'https://example.test' }
})

describe('movieService', () => {
  beforeEach(() => {
    ;(apiClient.get as any).mockReset()
    ;(apiClient.post as any).mockReset()
    ;(apiClient.put as any).mockReset()
    ;(apiClient.delete as any).mockReset()
  })

  it('getMovieById success and error', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({ status: 200, data: { data: { id: 1 } } })
    const ok = await getMovieById(1)
    expect(ok.success).toBe(true)

    ;(apiClient.get as any).mockRejectedValueOnce(new Error('boom'))
    const err = await getMovieById(2)
    expect(err.success).toBe(false)
  })

  it('getAllMovies and getAllInactiveMovies', async () => {
    ;(apiClient.get as any).mockResolvedValueOnce({ status: 200, data: { data: [] } })
    const all = await getAllMovies()
    expect(all.success).toBe(true)

    ;(apiClient.get as any).mockResolvedValueOnce({ status: 200, data: [] })
    const inactive = await getAllInactiveMovies()
    expect(inactive.success).toBe(true)
  })

  it('delete and real delete', async () => {
    ;(apiClient.delete as any).mockResolvedValue({ status: 200 })
    const del = await deleteMovieById(1)
    expect(del.success).toBe(true)
    const rdel = await realDeleteMovieById(1)
    expect(rdel.success).toBe(true)
  })

  it('createMovie and updateMovie', async () => {
    const payload: MoviePayload = {
      titulo: 't', sinopsis: 's', duracionMinutos: 10, fechaEstreno: '2020-01-01', directorId: 1, generosIds: [], plataformasIds: [], elenco: []
    }
    ;(apiClient.post as any).mockResolvedValue({ status: 201, data: { data: { id: 9 } } })
    const created = await createMovie(payload, null)
    expect(created.success).toBe(true)

    ;(apiClient.put as any).mockResolvedValue({ status: 200, data: { data: { id: 9 } } })
    const updated = await updateMovie(9, payload, null)
    expect(updated.success).toBe(true)
  })

  it('activateMovieById fail path', async () => {
    ;(apiClient.put as any).mockRejectedValue(new Error('nope'))
    const res = await activateMovieById(3)
    expect(res.success).toBe(false)
  })
})

describe('peopleService', () => {
  beforeEach(() => {
    ;(apiClient.post as any).mockReset()
  })

  it('createPerson actor success and error', async () => {
    ;(apiClient.post as any).mockResolvedValueOnce({ status: 201, data: { data: { id: 1, nombre: 'A' } } })
    const ok = await createPerson('A', 'actor', null)
    expect(ok.success).toBe(true)

    ;(apiClient.post as any).mockRejectedValueOnce(new Error('boom'))
    const err = await createPerson('B', 'actor', null)
    expect(err.success).toBe(false)
  })
})

