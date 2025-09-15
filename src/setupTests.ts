// Vitest + RTL setup
import '@testing-library/jest-dom/vitest'

// Silence React Router warnings for missing history in tests when not needed
// and jsdom window.scrollTo missing impls
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })

// Polyfill matchMedia used by some components/libraries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

// Provide a basic localStorage implementation for tests
class LocalStorageMock {
  private store: Record<string, string> = {}
  clear() { this.store = {} }
  getItem(key: string) { return this.store[key] ?? null }
  setItem(key: string, value: string) { this.store[key] = String(value) }
  removeItem(key: string) { delete this.store[key] }
}
// @ts-expect-error override for tests
global.localStorage = new LocalStorageMock()

