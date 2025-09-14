import apiClient from "./apiClient"

export const createPerson = async (nombre: string, type: "actor" | "director", image: File | null) => {
  try {
    const formData = new FormData()
    formData.append(type, new Blob([JSON.stringify({ nombre })], { type: "application/json" }))

    if (image) {
      formData.append("imagen", image)
    }

    const response = await apiClient.post(`/personas/${type}es`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    if (response.status === 201) {
      return { success: true, data: response.data }
    } else {
      console.error(`Error al crear ${type}:`, response.statusText)
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}