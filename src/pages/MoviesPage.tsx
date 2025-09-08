import MoviesGrid from "../components/movies/MoviesGrid"
import useMovies from "../hooks/useMovies"

export default function MoviesPage() {
  const { movies } = useMovies()

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20">
      <section className="space-y-3 py-20 text-center">
        <p className="text-4xl font-semibold tracking-tight text-white">Bienvenido Enzo</p>
        <p className="text-white/70">Descubrí las mejores películas acá.</p>
      </section>

      <MoviesGrid movies={movies} />
    </main>
  )
}