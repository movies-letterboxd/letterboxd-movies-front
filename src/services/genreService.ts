import apiClient from "./apiClient"

export type GenrePayload = {
  nombre: string
}

export const getAllGenres = async () => {
  try {
    const response = await apiClient.get("/generos")
    if (response.status === 200) {
      return { success: true, data: response.data.data }
    } else {
      console.error("Error al obtener géneros:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const deleteGenre = async (id: number) => {
  try {
    const response = await apiClient.delete(`/generos/${id}`)
    if (response.status === 200) {
      return { success: true }
    } else {
      console.error("Error al eliminar género:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createGenre = async (payload: GenrePayload) => {
  try {
    const response = await apiClient.post("/generos", payload)

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al crear género:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}

export const updateGenre = async (id: number, payload: GenrePayload) => {
  try {

    const response = await apiClient.put(`/generos/${id}`, payload)

    if (response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al actualizar género:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}
