import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Interceptor para añadir el token
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Usar el Read Access Token (Bearer)
  if (READ_ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${READ_ACCESS_TOKEN}`
  }

  // Usar la API Key como fallback
  if (API_KEY && !READ_ACCESS_TOKEN) {
    config.params = {
      ...config.params,
      api_key: API_KEY,
    }
  }

  return config
})

// Interceptor para manejo de errores
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Manejar sesión expirada
      localStorage.removeItem('tmdb-session-id')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
