import { useEffect, useState } from "react"
import type { Director } from "../types/Movie"
import { Trash2, Pencil, Plus } from "lucide-react"
import { toast } from "react-hot-toast"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import { BASE_URL } from "../services/apiClient"
import DirectorModal from "../components/attributes/DirectorModal"
import { deleteDirector, getAllDirectors } from "../services/directorService"
import Input from "../components/ui/Input"

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([])
  const [search , setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [confirm, setConfirm] = useState<{ open: boolean; id: number | null; name: string }>({
    open: false,
    id: null,
    name: "",
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editState, setEditState] = useState<{ open: boolean; director: Director | null }>({
    open: false,
    director: null
  })

  useEffect(() => {
    fetchDirectors()
  }, [])

  const fetchDirectors = async () => {
    try {
      setIsLoading(true)
      const response = await getAllDirectors()
      await new Promise(resolve => setTimeout(resolve, 500))
      if (response.success) setDirectors(response.data)
      else console.error("Error cargando directores", response.error)
    } catch (error: any) {
      console.error("Error cargando directores", error)
      toast.error("No se pudieron cargar los directores")
    } finally {
      setIsLoading(false)
    }
  }

  const askDelete = (id: number, name: string) => {
    setConfirm({ open: true, id, name })
  }

  const handleConfirmDelete = async () => {
    const id = confirm.id
    if (id == null) return

    try {
      setIsDeleting(true)
      const res = await deleteDirector(id)
      if (!res.success) throw new Error(res.error || "Error eliminando director")
      setDirectors(prev => prev.filter(d => d.id !== id))
      toast.success("Director eliminado")
    } catch (e: any) {
      toast.error(e.message ?? "Error eliminando director")
    } finally {
      setIsDeleting(false)
      setConfirm({ open: false, id: null, name: "" })
    }
  }

  const onCreated = (created: Director) => {
    setDirectors(prev => [created, ...prev])
    toast.success("Director creado")
  }

  const onUpdated = (updated: Director) => {
    setDirectors(prev => prev.map(d => d.id === updated.id ? { ...d, ...updated } : d))
    toast.success("Director actualizado")
  }

  const baseCell = "px-4 py-3"

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setSearch(inputValue)

    if (e.target.value === "") {
      fetchDirectors()
    } else {
      const filteredDirectors = directors.filter(
        (director) => (
          director.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
      )
      
      setDirectors(filteredDirectors)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-6">
        <h2 className="text-white text-xl font-semibold">
          Directores
        </h2>

        <Input
          className="flex-1 text-sm"
          placeholder="Buscar director"
          name="search"
          value={search}
          onChange={handleSearchChange}
        />

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-blue-600/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus size={16} />
          Nuevo director
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-left text-white/70 text-sm">
              <th className={`${baseCell} w-20`}>Logo</th>
              <th className={baseCell}>Nombre</th>
              <th className={`${baseCell} w-36 text-right`}>Acciones</th>
            </tr>
          </thead>

          <tbody className="text-white/90 text-sm">
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : directors.length === 0 ? (
              <tr>
                <td colSpan={3} className={`${baseCell} text-center text-white/60`}>
                  No hay directores disponibles
                </td>
              </tr>
            ) : (
              directors.map(p => (
                <tr key={p.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className={baseCell}>
                    {p.imagenUrl ? (
                      <img
                        src={p.imagenUrl.startsWith("/uploads") ? `${BASE_URL}${p.imagenUrl}` : p.imagenUrl}
                        alt={p.nombre}
                        className="size-10 rounded-md object-contain bg-white/10 ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="size-10 rounded-md bg-white/10 ring-1 ring-white/10" />
                    )}
                  </td>
                  <td className={baseCell}>
                    <span className="font-medium">{p.nombre}</span>
                  </td>
                  <td className={baseCell}>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditState({ open: true, director: p })}
                        className="rounded-md bg-white/10 p-2 text-sm text-white ring-1 ring-white/15 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={`Editar ${p.nombre}`}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => askDelete(p.id, p.nombre)}
                        className="rounded-md bg-red-600/90 p-2 text-sm font-medium text-white shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Eliminar ${p.nombre}`}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DirectorModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <DirectorModal
        isOpen={editState.open}
        initialDirector={editState.director ?? undefined}
        onClose={() => setEditState({ open: false, director: null })}
        onUpdated={onUpdated}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Eliminar director"
        description={`¿Seguro que querés eliminar “${confirm.name}”? Esta acción no se puede deshacer.`}
        onCancel={() => setConfirm(c => ({ ...c, open: false }))}
        onConfirm={handleConfirmDelete}
        confirmText="Eliminar"
        loading={isDeleting}
        danger
      />
    </>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-t border-white/10">
      <td className="px-4 py-3">
        <div className="size-10 rounded-md bg-white/10 animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-48 rounded bg-white/10 animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-24 ms-auto rounded bg-white/10 animate-pulse" />
      </td>
    </tr>
  )
}
