import axios from "axios"

const apiClient = axios.create({
  baseURL: 'http://18.222.250.152/api',
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
