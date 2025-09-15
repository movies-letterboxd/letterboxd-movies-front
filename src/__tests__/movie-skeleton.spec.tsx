import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MovieSkeleton from '../components/movies/MovieSkeleton'

describe('MovieSkeleton', () => {
  it('renders skeleton layout', () => {
    render(<MovieSkeleton />)
    // There should be multiple placeholder blocks; assert container rendered
    expect(screen.getByText((_, el) => el?.className.includes('animate-pulse') ?? false)).toBeInTheDocument()
  })
})

