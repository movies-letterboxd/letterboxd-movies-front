import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Layout from '../components/Layout'

describe('Header and Footer', () => {
  it('renders nav links and footer items', () => {
    render(
      <MemoryRouter>
        <Header />
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText('Películas')).toBeInTheDocument()
    expect(screen.getByText('Películas Inactivas')).toBeInTheDocument()
    expect(screen.getByText('Nueva Película')).toBeInTheDocument()
    expect(screen.getByText(/cineTrack/i)).toBeInTheDocument()
    expect(screen.getByText('Sobre nosotros')).toBeInTheDocument()
  })
})

describe('Layout scroll to top', () => {
  it('calls window.scrollTo on route change', async () => {
    const spy = vi.spyOn(window, 'scrollTo')
    render(
      <MemoryRouter initialEntries={["/movies"]}>
        <Layout>
          <Routes>
            <Route path="/movies" element={<div>Home</div>} />
            <Route path="/new-movie" element={<div>Nuevo</div>} />
          </Routes>
        </Layout>
      </MemoryRouter>
    )
    // Click header nav to go to new-movie
    fireEvent.click(screen.getByText('Nueva Película'))
    await waitFor(() => expect(screen.getByText('Nuevo')).toBeInTheDocument())
    expect(spy).toHaveBeenCalledWith(0, 0)
    spy.mockRestore()
  })
})

