import axios from "axios"

export const BASE_URL = 'https://movies.ufodevelopment.com';

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
