import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

describe('Input', () => {
  it('renders label and handles change', () => {
    const onChange = vi.fn()
    render(<Input name="q" label="Buscar" value="" onChange={onChange} placeholder="Buscar película" />)
    expect(screen.getByText('Buscar')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Buscar película') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Matrix' } })
    expect(onChange).toHaveBeenCalled()
  })
})

describe('Textarea', () => {
  it('renders label and handles change', () => {
    const onChange = vi.fn()
    render(<Textarea name="sinopsis" label="Sinopsis" value="" onChange={onChange} placeholder="Sinopsis" />)
    expect(screen.getByText('Sinopsis')).toBeInTheDocument()
    const ta = screen.getByPlaceholderText('Sinopsis') as HTMLTextAreaElement
    fireEvent.change(ta, { target: { value: 'Desc' } })
    expect(onChange).toHaveBeenCalled()
  })
})

