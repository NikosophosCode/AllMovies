import client from './api/client'
import { SEARCH_ENDPOINTS } from './api/endpoints'
import type { PaginatedResponse, Movie } from '@/types'

export const searchService = {
  async multi(query: string, page = 1): Promise<PaginatedResponse<unknown>> {
    const { data } = await client.get(SEARCH_ENDPOINTS.MULTI, {
      params: { query, page, language: 'es-ES' },
    })
    return data
  },

  async movies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(SEARCH_ENDPOINTS.MOVIE, {
      params: { query, page, language: 'es-ES' },
    })
    return data
  },

  async tv(query: string, page = 1) {
    const { data } = await client.get(SEARCH_ENDPOINTS.TV, {
      params: { query, page, language: 'es-ES' },
    })
    return data
  },

  async person(query: string, page = 1) {
    const { data } = await client.get(SEARCH_ENDPOINTS.PERSON, {
      params: { query, page },
    })
    return data
  },
}
