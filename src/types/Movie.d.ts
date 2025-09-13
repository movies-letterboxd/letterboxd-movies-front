export type Movie = {
  id: number
  titulo: string
  sinopsis: string
  duracionMinutos: number
  fechaEstreno: string
  poster: string
  activa: boolean
  director: Director
  generos: Genero[]
  plataformas: Plataforma[]
  elenco: Actor[]
}

export type Director = {
  id: number
  nombre: string
  imagen: string
}

export type Genero = {
  id: number
  nombre: string
}

export type Plataforma = {
  id: number
  nombre: string
  logoUrl: string
}

export type Actor = {
  id: number
  nombre: string
  nombrePersona: string
  personaje: string
  orden?: number
  imagenUrl: string
  imagenPersona: string;
}