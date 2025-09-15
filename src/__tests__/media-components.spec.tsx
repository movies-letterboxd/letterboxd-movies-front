import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PlatformBadge from '../components/movies/PlatformBadge'
import DirectorChip from '../components/movies/DirectorChip'
import { BASE_URL } from '../services/apiClient'

describe('PlatformBadge', () => {
  it('renders name and image', () => {
    render(<PlatformBadge name="Netflix" logoUrl="http://x/logo.png" />)
    expect(screen.getByText('Netflix')).toBeInTheDocument()
    const img = screen.getByAltText('Netflix') as HTMLImageElement
    expect(img.src).toContain('http://x/logo.png')
  })
  it('fallbacks on image error', () => {
    render(<PlatformBadge name="Netflix" logoUrl="http://broken/logo.png" />)
    const img = screen.getByAltText('Netflix') as HTMLImageElement
    fireEvent.error(img)
    expect(img.src).toContain('Logonetflix.png')
  })
})

describe('DirectorChip', () => {
  it('prefixes BASE_URL for uploads path', () => {
    render(<DirectorChip nombre="Lana" imagen="/uploads/dir.png" />)
    const img = screen.getByAltText('Directora/or: Lana') as HTMLImageElement
    expect(img.src).toContain(`${BASE_URL}/uploads/dir.png`)
  })
  it('fallbacks on image error', () => {
    render(<DirectorChip nombre="Lana" imagen="http://broken/dir.png" />)
    const img = screen.getByAltText('Directora/or: Lana') as HTMLImageElement
    fireEvent.error(img)
    expect(img.src).toContain('placehold.co/64x64')
  })
})
