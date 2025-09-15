import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Pill from '../components/movies/Pill'
import ActiveBadge from '../components/movies/ActiveBadge'
import GenreBadge from '../components/movies/GenreBadge'
import TextSkeleton from '../components/movies/TextSkeleton'
import PosterSkeleton from '../components/movies/PosterSkeleton'

describe('Pill', () => {
  it('renders children and className', () => {
    render(<Pill className="extra">Hola</Pill>)
    const el = screen.getByText('Hola')
    expect(el).toBeInTheDocument()
    expect(el).toHaveClass('extra')
  })
})

describe('ActiveBadge', () => {
  it('renders Activa when active', () => {
    render(<ActiveBadge active />)
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })
  it('renders Inactiva when not active', () => {
    render(<ActiveBadge active={false} />)
    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })
})

describe('GenreBadge', () => {
  it('renders label', () => {
    render(<GenreBadge label="Sci-Fi" />)
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
  })
})

describe('Skeletons', () => {
  it('renders TextSkeleton with width', () => {
    const { container } = render(<TextSkeleton w="w-1/2" />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.className).toContain('w-1/2')
  })
  it('renders PosterSkeleton', () => {
    const { container } = render(<PosterSkeleton />)
    const el = container.firstElementChild as HTMLElement
    expect(el).toBeInTheDocument()
  })
})
