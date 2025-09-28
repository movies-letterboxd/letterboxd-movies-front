import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { createPlatform, updatePlatform } from "../../services/platformService"
import type { Plataforma } from "../../types/Movie"
import { BASE_URL } from "../../services/apiClient"

interface Props {
  isOpen: boolean
  initialPlatform?: Plataforma
  onClose: () => void
  onCreated?: (p: Plataforma) => void
  onUpdated?: (p: Plataforma) => void
}

export default function PlatformModal({
  isOpen,
  initialPlatform,
  onClose,
  onCreated,
  onUpdated
}: Props) {
  const isEdit = !!initialPlatform

  const [name, setName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const initialPreview = useMemo(() => {
    if (initialPlatform?.logoUrl && initialPlatform.logoUrl.startsWith("/uploads")) {
      return `${BASE_URL}${initialPlatform.logoUrl}`
    }

    return initialPlatform?.logoUrl ?? null
  }, [initialPlatform?.logoUrl])

  useEffect(() => {
    if (!isOpen) return
    setName(initialPlatform?.nombre ?? "")
    setImage(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setSubmitting(false)
  }, [isOpen, initialPlatform])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }
    try {
      setSubmitting(true)
      if (isEdit && initialPlatform) {
        const res = await updatePlatform(initialPlatform.id,{ nombre: name.trim() }, image ?? null)
        if (!res.success) throw new Error(res.error || "Error actualizando plataforma")
        const updated = normalizePlatform(res.data ?? { id: initialPlatform.id, nombre: name.trim(), logoUrl: initialPlatform.logoUrl })
        onUpdated?.(updated)
        onClose()
      } else {
        const res = await createPlatform({ nombre: name.trim() }, image ?? null)
        if (!res.success) throw new Error(res.error || "Error creando plataforma")
        const created = normalizePlatform(res.data)
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
          {isEdit ? "Editar plataforma" : "Nueva plataforma"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white">Nombre*</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre de la plataforma"
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white">Logo (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white"
            />
            <div className="mt-2 aspect-[3/2] w-full overflow-hidden rounded-md border border-white/10 bg-white/5">
              {preview ? (
                <img src={preview} className="h-full w-full object-contain" />
              ) : initialPreview ? (
                <img src={initialPreview} className="h-full w-full object-contain" />
              ) : (
                <div className="grid h-full w-full place-content-center text-white/40">
                  Sin logo
                </div>
              )}
            </div>
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

function normalizePlatform(raw: any): Plataforma {
  return {
    id: raw.id,
    nombre: raw.nombre ?? raw.name ?? "",
    logoUrl: raw.logoUrl ?? raw.logo_url ?? raw.logo ?? null
  }
}
