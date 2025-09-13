// components/MovieDetail.tsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { Star } from "lucide-react"
import { type Movie } from "../types/Movie.d"
import { getMovieById } from "../services/movieService";
import MovieSkeleton from "../components/movies/MovieSkeleton";
import toast from "react-hot-toast";

export default function MoviePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  
  const fetchPelicula = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await getMovieById(Number(id));
      // Soportamos service que devuelve { data } o el objeto directamente
      const data = (res as any)?.data.data ?? res;
      setMovie(data as Movie);
    } catch (err: any) {
      console.error("Error cargando película", err);
      
      if (err?.response?.status === 404) {
        toast.error("La película no existe.");
        navigate("/movies");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPelicula();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading || !movie) {
    return <MovieSkeleton />
  }

  return (
    <div className="max-w-6xl mx-auto p-6 py-20 text-gray-100">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Poster + Plataformas */}
        <div className="col-span-1">
          <img
            src={movie.poster.startsWith("/uploads") ? `http://localhost:8080${movie.poster}` : movie.poster}
            alt={movie.titulo}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://placehold.co/500x750?text=Poster"
            }}
            className="w-full h-auto rounded-lg shadow-lg"
          />

          {/* Dónde ver */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Dónde ver</h2>
            <div className="flex flex-wrap gap-3">
              {movie.plataformas?.map((plataforma, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg"
                >
                  {plataforma.logoUrl && (
                    <img
                      src={plataforma.logoUrl}
                      alt={plataforma.nombre}
                      className="w-8 h-8 rounded"
                    />
                  )}
                  <span>{plataforma.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="col-span-2 flex flex-col justify-between">
          <div>
            {/* Encabezado: título + botones */}
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">{movie.titulo}</h1>
              <div className="flex gap-3">
                
              </div>
            </div>

            <p className="text-gray-400 text-lg mt-1">
              {movie.fechaEstreno?.slice(0, 4)} • {movie.duracionMinutos} min • Dirigida por{" "}
              <span className="text-gray-200">{movie.director?.nombre}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < (0) ? "text-green-400 fill-green-400" : "text-gray-700"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-400">{0}/5</span>
            </div>

            {/* Sinopsis */}
            <p className="mt-4 text-gray-200 leading-relaxed">{movie.sinopsis}</p>

            {/* Géneros */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Géneros</h2>
              <hr className="border-gray-500 mb-3" />
              <div className="flex flex-wrap gap-2">
                {movie.generos?.map((genero, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-600 rounded-lg p-5 flex-shrink-0 snap-center flex flex-col items-center text-center hover:bg-gray-700 transition w-[160px]"
                  >
                    {genero.nombre}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Elenco */}
          <div className="col-span-3 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Elenco</h2>

            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
              {movie?.elenco?.map((actor, idx) => (
                <div
                  key={idx}
                  className="bg-gray-600 rounded-lg p-5 flex-shrink-0 snap-center flex flex-col items-center text-center hover:bg-gray-700 transition w-[160px]"
                >
                  {actor.imagenPersona && (
                    <img
                      src={actor.imagenPersona}
                      alt={actor.nombrePersona}
                      className="w-24 h-24 object-cover rounded-full mb-2"
                    />
                  )}
                  <p className="font-semibold text-sm">{actor.nombrePersona}</p>
                  <p className="text-xs text-gray-400">{actor.personaje}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}