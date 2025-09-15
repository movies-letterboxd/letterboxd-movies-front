import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Select from '../components/ui/Select'

describe('Select', () => {
  it('renders placeholder and changes value', () => {
    const onChange = vi.fn()
    render(<Select name="dir" value="" placeholder="Elegir" onChange={onChange} />)
    const sel = screen.getByRole('combobox') as HTMLSelectElement
    expect(screen.getByText('Elegir')).toBeInTheDocument()
    fireEvent.change(sel, { target: { value: '' } })
    expect(onChange).toHaveBeenCalled()
  })
})

