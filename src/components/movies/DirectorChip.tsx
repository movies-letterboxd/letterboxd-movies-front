import { BASE_URL } from "../../services/apiClient";

export default function DirectorChip({ nombre, imagen }: { nombre: string; imagen: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-2 py-1">
      {
        imagen ? (
          <img
            src={imagen.startsWith("/uploads") ? `${BASE_URL}${imagen}` : imagen}
            alt={`Directora/or: ${nombre}`}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/64?text=?"
            }}
            className="h-5 w-5 rounded-full object-cover"
            loading="lazy"
          />
        ) : null
      } 
      <span className="text-xs text-white/80">{nombre}</span>
    </div>
  )
}