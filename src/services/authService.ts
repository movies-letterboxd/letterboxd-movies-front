import apiClient from "./apiClient"

export interface LoginUserProps {
  username: string
  password: string
}

export interface RegisterUserProps {
  username: string
  password: string
  email: string
  name: string
  lastName: string
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

export const registerUser = async ({ username, password, email, name, lastName }: RegisterUserProps) => {
  try {
    const response = await apiClient.post('/auth/register', { username, password, email, name, last_name: lastName })
    
    return { success: true, data: response }
  } catch (error: any) {
    if (error.response.status === 500) {
      return { success: false, error: { detail: 'El usuario ya existe.' }}
    } else {
      return { success: false, error: { detail: error.message }}
    }
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