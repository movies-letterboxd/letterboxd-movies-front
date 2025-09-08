import { useState } from "react"
import MOVIES_MOCK from "../mocks/movies"

export default function useMovies() {
  const [movies, setMovies] = useState(MOVIES_MOCK)

  return {
    movies  
  }
}