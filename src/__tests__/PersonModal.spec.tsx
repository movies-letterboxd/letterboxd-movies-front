import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PersonModal from '../components/movies/PersonModal'

vi.mock('../services/peopleService', () => ({
  createPerson: vi.fn(async () => ({ success: true, data: { data: { id: 7, name: 'Nuevo' } } }))
}))

const onClose = vi.fn()
const onCreated = vi.fn()

describe('PersonModal', () => {
  beforeEach(() => {
    onClose.mockReset()
    onCreated.mockReset()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  it('validates required name', async () => {
    render(<PersonModal isOpen type="actor" onClose={onClose} onCreated={onCreated} />)
    const submit = screen.getByRole('button', { name: 'Crear' })
    fireEvent.click(submit)
    // remains disabled state handled via component, but ensure it still present
    expect(submit).toBeDisabled()
  })

  it('submits and closes on success', async () => {
    render(<PersonModal isOpen type="director" onClose={onClose} onCreated={onCreated} />)
    const input = screen.getByPlaceholderText('Nombre del director') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Lana' } })
    const submit = screen.getByRole('button', { name: 'Crear' })
    expect(submit).not.toBeDisabled()
    fireEvent.click(submit)
    await waitFor(() => expect(onCreated).toHaveBeenCalled())
    expect(onClose).toHaveBeenCalled()
  })
})

