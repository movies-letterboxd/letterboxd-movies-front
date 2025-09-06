import { Star } from "lucide-react";
import { agregarAFavoritos, agregarAVistos } from "../services/DetailService";

type Movie = {
  posterUrl: string;
  title: string;
  year: number;
  duration: number;
  rating: number;
  synopsis: string;
  genres: string[];
};
export default function MovieDetail({ movie }: { movie: Movie }) {
  const agregarAVista = async () => {
    // Lógica para marcar como vista
    const result = await agregarAVistos(movie);
    if (result.success) {
      console.log(`Película "${movie.title}" marcada como vista.`);
    }
  }

  const agregarALista = async () => {
    // Lógica para agregar a la lista
    const result = await agregarAFavoritos(movie);
    if (result.success) {
      console.log(`Película "${movie.title}" agregada a la lista.`);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Card principal */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden grid md:grid-cols-3 gap-6">
        
        {/* Poster */}
        <div className="col-span-1">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="col-span-2 flex flex-col justify-between p-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-600">
              {movie.year} • {movie.duration} min
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < movie.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">
                {movie.rating}/5
              </span>
            </div>

            {/* Sinopsis */}
            <p className="mt-4 text-gray-700 leading-relaxed">
              {movie.synopsis}
            </p>

            {/* Géneros */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700" onClick={() => agregarAVista()}>
              Marcar como vista
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow hover:bg-gray-300" onClick={() => agregarALista()}>
              Agregar a lista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
