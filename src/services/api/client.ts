import axios, { AxiosError } from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { apiCache } from '@/utils/cache'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Interceptor para caché y autenticación
client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Solo cachear GET requests
  if (config.method === 'get') {
    const cacheKey = `${config.url}?${new URLSearchParams(config.params).toString()}`
    const cached = apiCache.get(cacheKey)

    if (cached) {
      // Retornar respuesta cacheada
      return {
        ...config,
        adapter: async () => {
          return {
            data: cached,
            status: 200,
            statusText: 'OK (cached)',
            headers: {},
            config,
          } as AxiosResponse
        },
      } as InternalAxiosRequestConfig
    }
  }

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

// Interceptor para manejo de errores y caché de respuestas
client.interceptors.response.use(
  (response) => {
    // Cachear respuestas exitosas de GET
    if (response.config.method === 'get') {
      const cacheKey = `${response.config.url}?${new URLSearchParams(response.config.params).toString()}`
      apiCache.set(cacheKey, response.data, 300) // 5 minutos de TTL
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Manejar sesión expirada
      localStorage.removeItem('tmdb-session-id')
      window.location.href = '/login'
    }

    if (error.response?.status === 429) {
      // Rate limit
      console.warn('⚠️ API rate limit reached. Please wait before making more requests.')
    }

    return Promise.reject(error)
  }
)

export default client
