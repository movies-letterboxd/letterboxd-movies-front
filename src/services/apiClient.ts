import axios from "axios"

export const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers:{
      "Content-Type": "application/json", 
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default apiClient;
