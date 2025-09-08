import { useEffect, useState } from "react";
import { Star, Pencil, Trash } from "lucide-react";

import { type Movie } from "../types/Movie";

const mockMovie2: Movie = {
  id: 1,
  titulo: "Tron: El legado",
  sinopsis: "Una película de prueba creada a partir de la tabla de personas.",
  duracionMinutos: 120,
  fechaEstreno: "2025-09-01",
  posterUrl: "https://m.media-amazon.com/images/I/61XBvHtqv2L._AC_SL1000_.jpg",
  activa: true,
  director: {
    nombre: "Anthony Ramos",
    imagen: "https://image.tmdb.org/t/p/w500/2Stnm8PQI7xHkVwINb4MhS7LOuR.jpg",
  },
  generos: [{ nombre: "Animación" }, { nombre: "Familia" }],
  plataformas: [
    {
      nombre: "Disney Plus",
      logoUrl: "https://image.tmdb.org/t/p/w500/97yvRBw1GzX7fXprcF80er19ot.jpg",
    },
  ],
  elenco: [
    {
      nombrePersona: "Garred Hedlund",
      personaje: "Sam Flynn",
      imagenPersona:
        "https://i.pinimg.com/736x/d4/24/b2/d424b295c456de6ad7b9cb14a19d54da.jpg",
    },
    {
      nombrePersona: "Olivia Wilde",
      personaje: "Quorra",
      imagenPersona:
        "https://www.lanacion.com.py/resizer/v2/https%3A%2F%2Fcloudfront-us-east-1.images.arcpublishing.com%2Flanacionpy%2F6PXXZRZHPZBAPLKN2BL5Q6PDHE.jpeg?auth=3fba8a5e1ee67750d65f8fe66697682ad84e6b0930e37744ce05c75dfb12a155&width=1280&smart=true",
    },
    {
      nombrePersona: "Jeff Bridges",
      personaje: "Kevin Flynn / Clu",
      imagenPersona:
        "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTBUcbVM-KGqe7tAlPap6_w1vHMY5SzNFHmI-opeAgJTv_am4Hu4eOy0x3uELxCQnnFyirmhm7WJ9eIxiQ",
    },
    {
      nombrePersona: "Michael Sheen",
      personaje: "Castor",
      imagenPersona:
        "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcRHQJvro6qa2d_CTxvN2Hkbbwg9sWQ3-Rc0wQ8-6GanyZWR8reAtIKREGUJziOqakQnUaOl6N_Y1qsllGg",
    },
    {
      nombrePersona: "Serinda Swan",
      personaje: "Sirena",
      imagenPersona:
        "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSdhYXkhkv6PTdyAU4dc9CEYCLrAWrPpEM-pDS6alnP5VcLaJmAB2yj1jkY339caaa_RUyhkPPeOio8f73sjqgNfHzfGhOSttA6TV6a0w",
    },
  ],
  rating: 4,
};

const agregarAVistos = async (movie: Movie) => {
  console.log(`Mock -> agregando a vistos: ${movie.titulo}`);
  return { success: true };
};

const agregarAFavoritos = async (movie: Movie) => {
  console.log(`Mock -> agregando a favoritos: ${movie.titulo}`);
  return { success: true };
};

export default function MovieDetail() {
  const [movie, setMovie] = useState<Movie | null>(null);

  const editarPelicula = async () => {
    if (!movie) return;
    const result = await agregarAVistos(movie);
    if (result.success) {
      console.log(`Película "${movie.titulo}" marcada como vista.`);
    }
  };

  const borrarPelicula = async () => {
    if (!movie) return;
    const result = await agregarAFavoritos(movie);
    if (result.success) {
      console.log(`Película "${movie.titulo}" agregada a la lista.`);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setMovie(mockMovie2);
    }, 1000);
  }, []);

    return (
    <div className="max-w-6xl mx-auto p-6 text-gray-100">
      {movie ? (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Poster + Plataformas */}
          <div className="col-span-1">
            <img
              src={movie.posterUrl}
              alt={movie.titulo}
              className="w-full h-auto rounded-lg shadow-lg"
            />

            {/* Dónde ver */}
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Dónde ver</h2>
              <div className="flex flex-wrap gap-3">
                {movie.plataformas.map((plataforma, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg"
                  >
                    <img
                      src={plataforma.logoUrl}
                      alt={plataforma.nombre}
                      className="w-8 h-8 rounded"
                    />
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
                <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={editarPelicula}
                >
                <Pencil />
                </button>
                <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={borrarPelicula}
                >
                <Trash />
                </button>
              </div>
              </div>

              <p className="text-gray-400 text-lg mt-1">
              {movie.fechaEstreno.slice(0, 4)} • {movie.duracionMinutos} min • Dirigida por{" "}
              <span className="text-gray-200">{movie.director.nombre}</span>
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                key={i}
                className={`w-6 h-6 ${
                  i < movie.rating ? "text-green-400 fill-green-400" : "text-gray-700"
                }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-400">{movie.rating}/5</span>
              </div>

              {/* Sinopsis */}
              <p className="mt-4 text-gray-200 leading-relaxed">{movie.sinopsis}</p>

              {/* Géneros */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Géneros</h2>
                <hr className="border-gray-500 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {movie.generos.map((genero, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
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
                {movie.elenco.map((actor, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-600 rounded-lg p-5 flex-shrink-0 snap-center flex flex-col items-center text-center hover:bg-gray-700 transition w-[160px]"
                  >
                    <img
                      src={actor.imagenPersona}
                      alt={actor.nombrePersona}
                      className="w-24 h-24 object-cover rounded-full mb-2"
                    />
                    <p className="font-semibold text-sm">{actor.nombrePersona}</p>
                    <p className="text-xs text-gray-400">{actor.personaje}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">Cargando...</div>
      )}
    </div>
  );
}