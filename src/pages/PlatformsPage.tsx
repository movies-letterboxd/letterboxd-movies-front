import { useEffect, useState } from "react"
import type { Plataforma } from "../types/Movie"
import { getAllPlatforms, deletePlatform } from "../services/platformService"
import { Trash2, Pencil, Plus } from "lucide-react"
import { toast } from "react-hot-toast"
import ConfirmDialog from "../components/ui/ConfirmDialog"
import PlatformModal from "../components/attributes/PlatformModal"
import { BASE_URL } from "../services/apiClient"
import Input from "../components/ui/Input"

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Plataforma[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [confirm, setConfirm] = useState<{ open: boolean; id: number | null; name: string }>({
    open: false,
    id: null,
    name: "",
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editState, setEditState] = useState<{ open: boolean; platform: Plataforma | null }>({
    open: false,
    platform: null
  })

  useEffect(() => {
    fetchPlatforms()
  }, [])

  const fetchPlatforms = async () => {
    try {
      setIsLoading(true)
      const response = await getAllPlatforms()
      await new Promise(resolve => setTimeout(resolve, 500))
      if (response.success) setPlatforms(response.data)
      else console.error("Error cargando plataformas", response.error)
    } catch (error: any) {
      console.error("Error cargando plataformas", error)
      toast.error("No se pudieron cargar las plataformas")
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
      const res = await deletePlatform(id)
      if (!res.success) throw new Error(res.error || "Error eliminando plataforma")
      setPlatforms(prev => prev.filter(p => p.id !== id))
      toast.success("Plataforma eliminada")
    } catch (e: any) {
      toast.error(e.message ?? "Error eliminando plataforma")
    } finally {
      setIsDeleting(false)
      setConfirm({ open: false, id: null, name: "" })
    }
  }

  const onCreated = (created: Plataforma) => {
    setPlatforms(prev => [created, ...prev])
    toast.success("Plataforma creada")
  }

  const onUpdated = (updated: Plataforma) => {
    setPlatforms(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p))
    toast.success("Plataforma actualizada")
  }

  const baseCell = "px-4 py-3"

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setSearch(inputValue)

    if (e.target.value === "") {
      fetchPlatforms()
    } else {
      const filteredPlatforms = platforms.filter(
        (platform) => (
          platform.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
      )
      
      setPlatforms(filteredPlatforms)
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-6">
        <h2 className="text-white text-xl font-semibold">Plataformas</h2>

        <Input
          className="flex-1 text-sm"
          placeholder="Buscar plataformas"
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
          Nueva plataforma
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
            ) : platforms.length === 0 ? (
              <tr>
                <td colSpan={3} className={`${baseCell} text-center text-white/60`}>
                  No hay plataformas disponibles
                </td>
              </tr>
            ) : (
              platforms.map(p => (
                <tr key={p.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  <td className={baseCell}>
                    {p.logoUrl ? (
                      <img
                        src={p.logoUrl.startsWith("/uploads") ? `${BASE_URL}${p.logoUrl}` : p.logoUrl}
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
                        onClick={() => setEditState({ open: true, platform: p })}
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

      <PlatformModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />

      <PlatformModal
        isOpen={editState.open}
        initialPlatform={editState.platform ?? undefined}
        onClose={() => setEditState({ open: false, platform: null })}
        onUpdated={onUpdated}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Eliminar plataforma"
        description={`¿Seguro que querés eliminar “${confirm.name}”? Esta acción no se puede deshacer.`}
        onCancel={() => setConfirm(c => ({ ...c, open: false }))}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        confirmText="Eliminar"
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
