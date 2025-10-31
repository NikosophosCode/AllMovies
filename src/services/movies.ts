import client from './api/client'
import { MOVIE_ENDPOINTS } from './api/endpoints'
import type { Movie, PaginatedResponse } from '@/types'

export const movieService = {
  async getNowPlaying(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.NOW_PLAYING, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  async getPopular(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.POPULAR, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  async getTopRated(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.TOP_RATED, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  async getUpcoming(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.UPCOMING, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  async getTrending(): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.TRENDING, {
      params: { language: 'es-ES' },
    })
    return data
  },

  async getDetails(id: number): Promise<Movie> {
    const { data } = await client.get(MOVIE_ENDPOINTS.DETAIL(id), {
      params: {
        language: 'es-ES',
        append_to_response: 'credits,videos,recommendations',
      },
    })
    return data
  },

  async getCredits(id: number) {
    const { data } = await client.get(MOVIE_ENDPOINTS.CREDITS(id))
    return data
  },

  async getVideos(id: number) {
    const { data } = await client.get(MOVIE_ENDPOINTS.VIDEOS(id), {
      params: { language: 'es-ES' },
    })
    return data
  },

  async getRecommendations(id: number, page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.RECOMMENDATIONS(id), {
      params: { page, language: 'es-ES' },
    })
    return data
  },
}
