import client from './api/client'
import { MOVIE_ENDPOINTS } from './api/endpoints'
import type { Movie, PaginatedResponse } from '@/types'

export const movieService = {
  async getNowPlaying(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.NOW_PLAYING, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getPopular(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.POPULAR, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getTopRated(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.TOP_RATED, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getUpcoming(page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.UPCOMING, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getTrending(timeWindow: 'day' | 'week' = 'day'): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(`/trending/movie/${timeWindow}`, {
      params: { language: 'es-ES' },
    })
    return data
  },

  async getDetails(id: number, language = 'es-ES'): Promise<Movie> {
    const { data } = await client.get(MOVIE_ENDPOINTS.DETAIL(id), {
      params: {
        language,
        append_to_response: 'credits,videos,recommendations,reviews',
      },
    })
    return data
  },

  async getCredits(id: number) {
    const { data } = await client.get(MOVIE_ENDPOINTS.CREDITS(id))
    return data
  },

  async getVideos(id: number, language = 'es-ES') {
    const { data } = await client.get(MOVIE_ENDPOINTS.VIDEOS(id), {
      params: { language },
    })
    return data
  },

  async getRecommendations(id: number, page = 1): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get(MOVIE_ENDPOINTS.RECOMMENDATIONS(id), {
      params: {
        page,
        language: 'es-ES',
      },
    })
    return data
  },

  async searchByFilters(
    filters: {
      genres?: number[]
      year?: number
      minRating?: number
      sortBy?: string
    },
    page = 1
  ): Promise<PaginatedResponse<Movie>> {
    const { data } = await client.get('/discover/movie', {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
        sort_by: filters.sortBy || 'popularity.desc',
        with_genres: filters.genres?.join(','),
        primary_release_year: filters.year,
        'vote_average.gte': filters.minRating,
      },
    })
    return data
  },
}
