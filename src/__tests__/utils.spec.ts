import { describe, it, expect, vi } from 'vitest'
import cls from '../utils/cls'
import formatMinutes from '../utils/formatMinutes'
import formatDate from '../utils/formatDate'

describe('utils/cls', () => {
  it('joins truthy classes with space', () => {
    expect(cls('a', 'b', 'c')).toBe('a b c')
  })
  it('filters out falsy values', () => {
    expect(cls('a', false as any, null as any, undefined as any, 'b')).toBe('a b')
  })
  it('returns empty string when nothing truthy', () => {
    expect(cls(undefined as any, null as any, false as any)).toBe('')
  })
})

describe('utils/formatMinutes', () => {
  it('formats minutes with suffix', () => {
    expect(formatMinutes(90)).toBe('90 min')
  })
})

describe('utils/formatDate', () => {
  it('delegates to toLocaleDateString with options', () => {
    const spy = vi.spyOn(Date.prototype, 'toLocaleDateString').mockReturnValue('Jan 01, 2020' as any)
    const out = formatDate('2020-01-01')
    expect(out).toBe('Jan 01, 2020')
    expect(spy).toHaveBeenCalled()
    const [, opts] = spy.mock.calls[0]
    expect((opts as any)?.year).toBe('numeric')
    expect((opts as any)?.month).toBe('short')
    expect((opts as any)?.day).toBe('2-digit')
    spy.mockRestore()
  })
})

