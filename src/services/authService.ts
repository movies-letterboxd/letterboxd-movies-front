import apiClient from "./apiClient"

export interface LoginUserProps {
  username: string
  password: string
}

export const loginUser = async ({ username, password }: LoginUserProps) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password})

    if (response.status === 200) {
      return { success: true, data: response.data }
    } else {
      return { success: false, error: response.statusText }
    }
  } catch (error: any) {
    return { success: false, error: error.message}
  }
}

export const decodeToken = async () => {
  try {
    const response = await apiClient.get('/auth/decode')
    return { success: true, data: response.data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}