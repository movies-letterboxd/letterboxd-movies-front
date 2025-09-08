export interface Movie {
    id: number;
    titulo: string;
    sinopsis: string;
    duracionMinutos: number;
    fechaEstreno: string; // ISO date string
    posterUrl: string;
    activa: boolean;
    director: Director;
    generos: Genero[];
    elenco: Elenco[];
    plataformas: Plataforma[];
    rating: number; // Optional rating field
}

export interface Persona {
    nombre: string;
    // otros campos relevantes
}

export interface Genero {
    nombre: string;
}

export interface Elenco {
  nombrePersona: string;
  personaje: string;
  imagenPersona: string;
};

export interface Director {
    nombre: string;
    imagen: string;
}

export interface Plataforma {
    nombre: string;
    logoUrl: string;
}