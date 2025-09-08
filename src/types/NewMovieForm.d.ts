export type NewMovieForm = {
  titulo: string
  sinopsis: string
  duracionMinutos: string
  fechaEstreno: string
  directorId: string
  generosIds: number[]
  plataformasIds: number[]
  elenco: {
    personaId: number
    personaje: string
    orden: number
  }[]
}