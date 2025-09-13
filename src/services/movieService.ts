import apiClient from "./apiClient"

export type MoviePayload = {
  titulo: string;
  sinopsis: string;
  duracionMinutos: number;
  fechaEstreno: string;
  directorId: number;
  generosIds: number[];
  plataformasIds: number[];
  elenco: Array<{ personaId: number; personaje: string; orden: number }>;
};

export const getMovieById = async (id: number) => {
  try {
    const response = await apiClient.get(`/peliculas/${id}`)

    if (response.status === 200) {
      return { success: true, data: response.data }
    } else {
      console.error("Error al obtener película por ID:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const getAllMovies = async () => {
  try {
    const response = await apiClient.get("/peliculas")
    if (response.status === 200) {
      return { success: true, data: response.data }
    } else {
      console.error("Error al obtener películas:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const deleteMovieById = async (id: number) => {
  try {
    const response = await apiClient.delete(`/peliculas/${id}/eliminar`)
    if (response.status === 200) {
      return { success: true }
    } else {
      console.error("Error al eliminar película:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createMovie = async (movieData: MoviePayload, imageFile: File | null) => {
  try {
    const formData = new FormData()
    formData.append("pelicula", new Blob([JSON.stringify(movieData)], { type: "application/json" }))

    if (imageFile) {
      formData.append("imagen", imageFile)
    }

    const response = await apiClient.post("/peliculas", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.status === 201) {
      return { success: true, data: response.data }
    } else {
      console.error("Error al crear película:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateMovie(id: number, movieData: MoviePayload, imageFile: File | null) {
  try {
    const formData = new FormData();
    formData.append(
      "pelicula",
      new Blob([JSON.stringify(movieData)], { type: "application/json" })
    );
  
    if (imageFile) {
      formData.append("imagen", imageFile);
    }
  
    const res = await apiClient.put(`/peliculas/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status === 200) {
      return { success: true, data: res.data };
    } else {
      console.error("Error al actualizar película:", res.statusText);
      return { success: false, error: res.statusText };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}