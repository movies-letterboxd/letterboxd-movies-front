import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { createPerson } from "../../services/peopleService"
import cls from "../../utils/cls"

type PersonType = "actor" | "director"

interface PersonModalProps {
  isOpen: boolean
  type: PersonType
  onClose: () => void
  onCreated: (created: { id: number; name: string }) => void
}

export default function PersonModal({ isOpen, type, onClose, onCreated }: PersonModalProps) {
  const [name, setName] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  useEffect(() => {
    if (!isOpen) {
      setName("")
      if (preview) URL.revokeObjectURL(preview)
      setPreview(null)
      setImage(null)
      setSubmitting(false)
    }
  }, [isOpen])

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
    setSubmitting(true)
    const res = await createPerson(name.trim(), type, image)
    setSubmitting(false)

    if (res.success) {
      const created = res.data?.data ?? res.data
      toast.success(`${type === "actor" ? "Actor" : "Director"} creado ✅`)
      onCreated({ id: created.id, name: created.name ?? created.nombre ?? name.trim() })
      onClose()
    } else {
      toast.error(`Error creando ${type}: ${res.error}`)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#121826] p-5 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Nuevo {type === "actor" ? "actor" : "director"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-white">Nombre*</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={`Nombre del ${type}`}
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-white">Imagen (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-white"
            />
            <div className="mt-2 aspect-[3/2] w-full overflow-hidden rounded-md border border-white/10 bg-white/5">
              {preview ? (
                <img src={preview} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-content-center text-white/40">
                  Sin imagen
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
              className={cls(
                "flex-1 rounded-md px-4 py-2 font-semibold text-white transition",
                submitting || !name.trim()
                  ? "bg-blue-500/60 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-500/80"
              )}
            >
              {submitting ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
