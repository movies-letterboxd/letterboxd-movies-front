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
    const request = await fetch('http://users-prod-alb-1703954385.us-east-1.elb.amazonaws.com/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, email, name, last_name: lastName })
    })

    const response = await request.json()
    
    if (request.status === 201) {
      return { success: true, data: response }
    } else {
      return { success: false, error: response }
    }
  } catch (error: any) {
    return { success: false, error: error.message }
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