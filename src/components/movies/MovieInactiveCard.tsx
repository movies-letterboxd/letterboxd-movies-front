import { Link, useNavigate } from "react-router"
import type { Movie } from "../../types/Movie"
import formatDate from "../../utils/formatDate"
import formatMinutes from "../../utils/formatMinutes"
import ActiveBadge from "./ActiveBadge"
import DirectorChip from "./DirectorChip"
import GenreBadge from "./GenreBadge"
import Pill from "./Pill"
import PlatformBadge from "./PlatformBadge"
import { useState } from "react"
import ConfirmDialog from "../ui/ConfirmDialog"
import { activateMovieById } from "../../services/movieService"
import toast from "react-hot-toast"
import { Eye, Pencil } from "lucide-react"
import { BASE_URL } from "../../services/apiClient"
import { availablePermissions, hasPermission } from "../../utils/permissions"
import { useAuthContext } from "../../contexts/AuthContext"

interface Props {
  movie: Movie
  handleDeleteMovie: (id: number) => void
}

export default function MovieInactiveCard({ movie, handleDeleteMovie }: Props) {
  const navigate = useNavigate()
  const { permissions } = useAuthContext()
  const [openActivateConfirm, setOpenActivateConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleMovieClick = (e: React.MouseEvent) => {
    if (deleting || openActivateConfirm) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    navigate(`/movies/${movie.id}`)
  }

  const handleActivateClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenActivateConfirm(true)
  }

  const handleConfirmActivate = async () => {
    try {
      setDeleting(true)
      const response = await activateMovieById(movie.id)
      if (response.success) {
        handleDeleteMovie(movie.id)
        setOpenActivateConfirm(false)
        toast.success("Película activada con éxito.")
      }
    } finally {
      setDeleting(false)
    }
  }

  const canEdit = hasPermission(permissions, availablePermissions.EDIT_MOVIE)
  const canDelete = hasPermission(permissions, availablePermissions.DELETE_MOVIE)
  
  return (
    <article
      onClick={handleMovieClick}
      className="group relative cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-2 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] transition hover:scale-[1.01] hover:border-white/20"
      aria-label={`Película: ${movie?.titulo}`}
    >
      {(canEdit || canDelete) && (
        <div className="absolute right-2 top-2 z-20 flex items-center gap-2 p-2">
          {canEdit && (
            <button
              type="button"
              onClick={handleActivateClick}
              className="rounded-md bg-green-600/90 p-2 text-sm font-medium text-white shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <Eye size={16} />
            </button>
          )}

          {canEdit && (
            <Link
              to={`/movies/${movie.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="rounded-md cursor-default bg-blue-600/90 p-2 text-sm font-medium text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Pencil size={16} />
            </Link>
          )}
        </div>
      )}

      <div className="relative">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={movie?.poster?.startsWith("/uploads") ? `${BASE_URL}${movie?.poster}` : movie?.poster}
            alt={`Poster de ${movie?.titulo}`}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://placehold.co/500x750?text=Poster"
            }}
            className="aspect-[2/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-2">
            <ActiveBadge active={movie?.activa} />
            <Pill className="bg-black/50 text-white/80 border border-white/10">
              {formatMinutes(movie?.duracionMinutos)}
            </Pill>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        <header className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 text-balance text-lg font-semibold text-white">
            {movie?.titulo}
          </h2>
          <Pill
            className="shrink-0 bg-white/5 text-white/60 border border-white/10"
            title="Fecha de estreno"
          >
            {formatDate(movie?.fechaEstreno)}
          </Pill>
        </header>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">Dirección:</span>
          <DirectorChip nombre={movie?.director?.nombre} imagen={movie?.director?.imagen ?? ''} />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {movie?.generos?.slice(0, 4).map((g) => (
            <GenreBadge key={g.id} label={g.nombre} />
          ))}
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-white/80">
          {movie.sinopsis}
        </p>

        {movie.plataformas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/50">Disponible en:</span>
            <div className="flex flex-wrap gap-1.5">
              {movie?.plataformas?.slice(0, 4).map((p) => (
                <PlatformBadge key={p.id} name={p?.nombre} logoUrl={p?.logoUrl} />
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="absolute inset-0 -z-10" aria-hidden tabIndex={-1} />

      <ConfirmDialog
        open={openActivateConfirm}
        title="Activar película"
        description={`¿Seguro que querés activar “${movie.titulo}”? Esta acción permitirá que se vea en el sitio nuevamente.`}
        onCancel={() => setOpenActivateConfirm(false)}
        onConfirm={handleConfirmActivate}
        confirmText="Activar"
        loading={deleting}
      />

      {deleting && (
        <div className="pointer-events-none absolute inset-0 z-30 rounded-2xl bg-black/30" />
      )}
    </article>
  )
}
