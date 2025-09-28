import apiClient from "./apiClient"

export type DirectorPayload = {
  nombre: string
}

export const getAllDirectors = async () => {
  try {
    const response = await apiClient.get("/personas/directores")
    if (response.status === 200) {
      return { success: true, data: response.data }
    } else {
      console.error("Error al obtener directores:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const deleteDirector = async (id: number) => {
  try {
    const response = await apiClient.delete(`/personas/directores/${id}`)
    if (response.status === 200) {
      return { success: true }
    } else {
      console.error("Error al eliminar director:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createDirector = async (payload: DirectorPayload, imageFile: File | null) => {
  try {
    const formData = new FormData()
    formData.append(
      "director",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    )
    if (imageFile) {
      formData.append("imagen", imageFile)
    }

    const response = await apiClient.post("/personas/directores", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al crear director:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}

export const updateDirector = async (id: number, payload: DirectorPayload, imageFile: File | null) => {
  try {
    const formData = new FormData()
    formData.append(
      "director",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    )

    if (imageFile) {
      formData.append("imagen", imageFile)
    }

    const response = await apiClient.put(`/personas/directores/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    if (response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al actualizar director:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}
