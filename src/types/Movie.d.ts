export type Movie = {
  id: number
  titulo: string
  sinopsis: string
  duracionMinutos: number
  fechaEstreno: string
  poster: string
  activa: boolean
  director: {
    id: number
    nombre: string
    imagen: string
  }
  generos: {
    id: number
    nombre: string
  }[]
  plataformas: {
    id: number
    nombre: string
    logoUrl: string
  }[]
  elenco: {
    id: number
    nombrePersona: string
    personaje: string
    orden: number
    imagenPersona: string
  }[]
}
