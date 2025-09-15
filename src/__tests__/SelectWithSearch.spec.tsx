import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SelectWithSearch, { type Option } from '../components/ui/SelectWithSearch'

function setup(options: Option[] = [
  { value: '1', label: 'Uno' },
  { value: '2', label: 'Dos' },
  { value: '3', label: 'Tres' },
]) {
  let current: string | number | null = null
  const onChange = (opt: Option | null) => { current = opt ? opt.value : null }
  const utils = render(
    <SelectWithSearch name="x" value={current} options={options} onChange={onChange} placeholder="Buscar..." />
  )
  return { ...utils, getCurrent: () => current }
}

describe('SelectWithSearch', () => {
  it('filters local options and selects with click', () => {
    const { getByPlaceholderText, getByText, getCurrent } = setup()
    const input = getByPlaceholderText('Buscar...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Do' } })
    fireEvent.focus(input)
    const opt = getByText('Dos')
    fireEvent.mouseDown(opt)
    expect(getCurrent()).toBe('2')
  })

  it('shows clear button and clears selection', () => {
    const { getByPlaceholderText, getByText, container } = setup()
    const input = getByPlaceholderText('Buscar...') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'Un' } })
    fireEvent.focus(input)
    const opt = getByText('Uno')
    fireEvent.mouseDown(opt)
    const clearBtn = container.querySelector('button[aria-label="Limpiar selección"]') as HTMLButtonElement
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn)
    expect((container.querySelector(`input[name="x"]`) as HTMLInputElement).value).toBe('')
  })
})

