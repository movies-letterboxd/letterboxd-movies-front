import axios from "axios"
export const BASE_URL = 'http://localhost:8080'

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers:{
    "Content-Type": "application/json", 
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const userStorage = window.localStorage.getItem('user')
    const user = userStorage ? JSON.parse(userStorage) : null
    
    if (user?.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token.trim()}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient