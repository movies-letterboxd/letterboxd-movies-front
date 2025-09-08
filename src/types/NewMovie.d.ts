export type NewMovie = {
  titulo: string
  sinopsis: string
  duracionMinutos: number
  fechaEstreno: string
  directorId: number
  generosIds: number[]
  plataformasIds: number[]
  elenco: {
    personaId: number
    personaje: string
    orden: number
  }[]
}