import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmDialog from '../components/ui/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('does not render when open=false', () => {
    const { container } = render(
      <ConfirmDialog open={false} title="Title" onCancel={() => {}} onConfirm={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders and calls handlers', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog open title="Eliminar" description="Desc" onCancel={onCancel} onConfirm={onConfirm} />
    )
    expect(screen.getByText('Eliminar')).toBeInTheDocument()
    // clicks overlay triggers cancel
    const overlay = screen.getByRole('dialog').previousSibling as HTMLElement
    fireEvent.click(overlay)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('confirms and supports Escape key', () => {
    const onCancel = vi.fn()
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog open title="Eliminar" onCancel={onCancel} onConfirm={onConfirm} />
    )
    const confirmBtn = screen.getByRole('button', { name: 'Eliminar' })
    fireEvent.click(confirmBtn)
    expect(onConfirm).toHaveBeenCalledTimes(1)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onCancel).toHaveBeenCalled()
  })
})

