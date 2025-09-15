import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SelectWithSearch, { type Option } from '../components/ui/SelectWithSearch'

describe('SelectWithSearch behavior', () => {
  it('fetches remote options via fetcher and selects with keyboard', async () => {
    const fetcher = vi.fn(async (q: string) => {
      await new Promise(r => setTimeout(r, 0))
      return [{ value: 'r1', label: `Remote ${q}` }]
    })
    let value: string | number | null = null
    const onChange = (opt: Option | null) => { value = opt ? opt.value : null }
    render(
      <SelectWithSearch name="remote" value={value} onChange={onChange} fetcher={fetcher} minChars={1} options={[{ value: 'l1', label: 'Local' }]} />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'A' } })
    await waitFor(() => expect(fetcher).toHaveBeenCalled())
    // move highlight and select with Enter
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(value).not.toBeNull()
  })

  it('shows error message when fetcher rejects', async () => {
    const fetcher = vi.fn(async () => { throw new Error('HTTP 500') })
    render(
      <SelectWithSearch name="remote" value={null} onChange={() => {}} fetcher={fetcher} minChars={1} />
    )
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'X' } })
    await waitFor(() => expect(screen.getByText('HTTP 500')).toBeInTheDocument())
  })
})

