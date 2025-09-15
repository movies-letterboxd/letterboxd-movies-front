import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DirectorChip from '../components/movies/DirectorChip'
import PlatformBadge from '../components/movies/PlatformBadge'
import ConfirmDialog from '../components/ui/ConfirmDialog'

describe('Branch coverage for components', () => {
  it('DirectorChip without image does not render img', () => {
    render(<DirectorChip nombre="NoImage" imagen="" />)
    expect(screen.getByText('NoImage')).toBeInTheDocument()
    expect(document.querySelector('img')).toBeNull()
  })

  it('PlatformBadge renders without logo', () => {
    render(<PlatformBadge name="Prime" logoUrl="" />)
    expect(screen.getByText('Prime')).toBeInTheDocument()
  })

  it('ConfirmDialog with danger=false uses custom text and calls confirm', () => {
    const onConfirm = vi.fn(); const onCancel = vi.fn()
    render(<ConfirmDialog open title="T" confirmText="OK" danger={false} onCancel={onCancel} onConfirm={onConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: 'OK' }))
    expect(onConfirm).toHaveBeenCalled()
  })

})
