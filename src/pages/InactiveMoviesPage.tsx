import { useEffect, useState } from "react";
import MoviesGrid from "../components/movies/MoviesGrid"
import type { Movie } from "../types/Movie";
import { getAllInactiveMovies } from "../services/movieService";
import Input from "../components/ui/Input";

export default function InactiveMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchPeliculas()
  }, [])
  
  const fetchPeliculas = async () => {
    try {
      setIsLoading(true)
      const response = await getAllInactiveMovies()

      if (response.success) {
        setMovies(response.data)
      } else {
        console.error("Error cargando películas", response.error)
      }
    } catch (error: any) {
      console.error("Error cargando película", error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMovie = (id: number) => {
    setMovies((prevMovies) => (
      prevMovies.filter((movie) => movie.id !== id)
    ))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value.toLowerCase());

    if (e.target.value === "") {
      fetchPeliculas();
    } else {
      const filteredMovies = movies.filter((movie) =>
        movie.titulo.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setMovies(filteredMovies);
    }
  }
  
  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="space-y-3 py-20 text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">Películas Inactivas</p>
        <p className="text-white/70 text-pretty max-w-xl mx-auto">Aquí se muestran todas las películas desactivadas. Podés eliminarlas de forma permanente o volver a activarlas.</p>
      </section>

      <div className="pb-5">
        <Input
          type="text"
          placeholder="Buscar película..."
          name="search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <MoviesGrid 
        isLoading={isLoading} 
        movies={movies} 
        handleDeleteMovie={handleDeleteMovie}
        isInactivePage={true}
      />
    </main>
  )
}