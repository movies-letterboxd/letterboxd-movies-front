import { useEffect, useMemo, useRef, useState } from "react"
import cls from "../../utils/cls";

export type Option = { value: string | number; label: string }

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

interface SelectWithSearchProps {
  className?: string
  name: string
  value: string | number | null
  label?: string
  placeholder?: string
  options?: Option[]
  fetchUrl?: string
  fetcher?: (q: string, signal: AbortSignal) => Promise<Option[]>
  combineResults?: boolean
  minChars?: number
  disabled?: boolean
  onChange: (opt: Option | null) => void
}

export default function SelectWithSearch({
  className = "",
  name,
  value,
  label,
  placeholder = "Buscar...",
  options = [],
  fetchUrl,
  fetcher,
  combineResults = true,
  minChars = 2,
  disabled,
  onChange
}: SelectWithSearchProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remote, setRemote] = useState<Option[]>([])
  const [highlight, setHighlight] = useState(0)
  const debouncedQuery = useDebouncedValue(input, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const shouldFetch = !!(fetcher || fetchUrl)

  const selected = useMemo(
    () => [...options, ...remote].find(o => o.value === value) ?? null,
    [options, remote, value]
  )

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  useEffect(() => {
    if (!open || !shouldFetch) return
    const q = debouncedQuery.trim()
    if (q.length < minChars) {
      setRemote([])
      setError(null)
      setLoading(false)
      return
    }
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        let data: Option[]
        if (fetcher) {
          data = await fetcher(q, ac.signal)
        } else {
          const url = new URL(fetchUrl!, window.location.origin)
          url.searchParams.set("q", q)
          const res = await fetch(url.toString(), { signal: ac.signal })
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          data = await res.json()
        }
        setRemote(Array.isArray(data) ? data : [])
        setHighlight(0)
      } catch (err: any) {
        if (err?.name !== "AbortError") setError(err?.message ?? "Error")
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => ac.abort()
  }, [debouncedQuery, open, shouldFetch, fetchUrl, fetcher, minChars])

  const filteredLocal = useMemo(() => {
    const q = input.trim().toLowerCase()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [input, options])

  const mergedOptions: Option[] = useMemo(() => {
    if (!combineResults) return shouldFetch ? remote : filteredLocal
    const map = new Map<string | number, Option>()
    for (const o of filteredLocal) map.set(o.value, o)
    for (const o of remote) map.set(o.value, o)
    return Array.from(map.values())
  }, [combineResults, filteredLocal, remote, shouldFetch])

  const handleSelect = (opt: Option | null) => {
    onChange(opt)
    setOpen(false)
    if (opt) setInput(opt.label)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlight(h => Math.min(h + 1, mergedOptions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlight(h => Math.max(h - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (mergedOptions[highlight]) handleSelect(mergedOptions[highlight])
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (selected) setInput(selected.label)
    if (value == null) setInput("")
  }, [value]) 

  return (
    <div ref={wrapperRef} className={cls("flex flex-col gap-1 relative", className)}>
      {label && <label className="text-white">{label}</label>}

      <div className="relative">
        <input
          name={`${name}__search`}
          type="text"
          className={cls("w-full bg-white p-2 rounded-md border-[#90A1B9] outline-none disabled:bg-gray-100 disabled:text-gray-500")}
          placeholder={placeholder}
          value={input}
          disabled={!!selected || disabled}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            const v = e.target.value
            setInput(v)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        {selected && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-red-500/80 bg-red-500 text-white p-2 rounded-full text-xs size-6 flex items-center justify-center font-bold"
            onClick={() => {
              setInput("")
              onChange(null)
              setOpen(true)
            }}
            aria-label="Limpiar selección"
          >
            x
          </button>
        )}
      </div>

      <input type="hidden" name={name} value={value ?? ""} />

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-[#90A1B9] bg-white shadow-lg">
          {loading && <div className="px-3 py-2 text-sm text-gray-600">Buscando…</div>}
          {error && !loading && <div className="px-3 py-2 text-sm text-red-600">{error}</div>}
          {!loading && !error && mergedOptions.length === 0 && input.trim().length >= (shouldFetch ? minChars : 0) && (
            <div className="px-3 py-2 text-sm text-gray-600">Sin resultados</div>
          )}
          {!loading && !error && mergedOptions.length > 0 && (
            <ul className="max-h-60 overflow-auto">
              {mergedOptions.map((opt, idx) => (
                <li
                  key={`${opt.value}`}
                  className={"px-3 py-2 cursor-pointer " + (idx === highlight ? "bg-gray-100" : "bg-white")}
                  onMouseEnter={() => setHighlight(idx)}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt) }}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
