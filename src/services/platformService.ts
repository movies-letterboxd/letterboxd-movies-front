import apiClient from "./apiClient"

export type PlatformPayload = {
  nombre: string
}

export const getAllPlatforms = async () => {
  try {
    const response = await apiClient.get("/plataformas")
    if (response.status === 200) {
      return { success: true, data: response.data.data }
    } else {
      console.error("Error al obtener plataformas:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const deletePlatform = async (id: number) => {
  try {
    const response = await apiClient.delete(`/plataformas/${id}`)
    if (response.status === 200) {
      return { success: true }
    } else {
      console.error("Error al eliminar plataforma:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const createPlatform = async (payload: PlatformPayload, logoFile: File | null) => {
  try {
    const formData = new FormData()
    formData.append(
      "plataforma",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    )
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    const response = await apiClient.post("/plataformas", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    if (response.status === 201 || response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al crear plataforma:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}

export const updatePlatform = async (id: number, payload: PlatformPayload, logoFile: File | null) => {
  try {
    const formData = new FormData()
    formData.append(
      "plataforma",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    )
    
    if (logoFile) {
      formData.append("logo", logoFile)
    }

    const response = await apiClient.put(`/plataformas/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    if (response.status === 200) {
      return { success: true, data: response.data?.data ?? response.data }
    } else {
      console.error("Error al actualizar plataforma:", response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.response?.data || error.message}
  }
}
