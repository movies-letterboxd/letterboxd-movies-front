import type { Movie } from "../../types/Movie";
import MovieCard from "./MovieCard";
import { MovieCardSkeleton } from "./MovieCardSkeleton";

export default function MoviesGrid({ movies, isLoading }: { movies: Movie[]; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {movies.map((m) => (
        <MovieCard key={m.id} movie={m} />
      ))}
    </div>
  )
}