import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import type { Genero } from "../../types/Movie"
import { createGenre, updateGenre } from "../../services/genreService"

interface Props {
  isOpen: boolean
  initialGenre?: Genero
  onClose: () => void
  onCreated?: (p: Genero) => void
  onUpdated?: (p: Genero) => void
}

export default function GenreModal({
  isOpen,
  initialGenre,
  onClose,
  onCreated,
  onUpdated
}: Props) {
  const isEdit = !!initialGenre

  const [name, setName] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setName(initialGenre?.nombre ?? "")
   
   
    setSubmitting(false)
  }, [isOpen, initialGenre])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    try {
      setSubmitting(true)
      if (isEdit && initialGenre) {
        const res = await updateGenre(initialGenre.id,{ nombre: name.trim() })
        if (!res.success) throw new Error(res.error || "Error actualizando género")
        const updated = normalizeGenre(res.data ?? { id: initialGenre.id, nombre: name.trim() })
        onUpdated?.(updated)
        onClose()
      } else {
        const res = await createGenre({ nombre: name.trim() })
        if (!res.success) throw new Error(res.error || "Error creando género")
        const created = normalizeGenre(res.data)
        onCreated?.(created)
        onClose()
      }
    } catch (err: any) {
      toast.error(err.message ?? "Ocurrió un error")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#121826] p-5 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">
          {isEdit ? "Editar género" : "Nuevo género"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white">Nombre*</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre del género"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md bg-white/10 px-4 py-2 text-white hover:bg-white/15"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className={`flex-1 rounded-md px-4 py-2 font-semibold text-white transition ${submitting || !name.trim() ? "bg-blue-500/60 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-500/80"}`}
            >
              {submitting ? (isEdit ? "Guardando..." : "Creando...") : (isEdit ? "Guardar" : "Crear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function normalizeGenre(raw: any): Genero {
  return {
    id: raw.id,
    nombre: raw.nombre ?? raw.name ?? "",
  }
}
