import client from './api/client'
import { TV_ENDPOINTS } from './api/endpoints'
import type { Series, PaginatedResponse, Season, Episode } from '@/types'

export const seriesService = {
  async getPopular(page = 1): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get(TV_ENDPOINTS.POPULAR, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getTopRated(page = 1): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get(TV_ENDPOINTS.TOP_RATED, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getOnTheAir(page = 1): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get(TV_ENDPOINTS.ON_THE_AIR, {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
      },
    })
    return data
  },

  async getTrending(timeWindow: 'day' | 'week' = 'day'): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get(`/trending/tv/${timeWindow}`, {
      params: { language: 'es-ES' },
    })
    return data
  },

  async getDetails(id: number, language = 'es-ES'): Promise<Series> {
    const { data } = await client.get(TV_ENDPOINTS.DETAIL(id), {
      params: {
        language,
        append_to_response: 'credits,videos,recommendations,reviews',
      },
    })
    return data
  },

  async getSeason(id: number, season: number, language = 'es-ES'): Promise<Season> {
    const { data } = await client.get(TV_ENDPOINTS.SEASON(id, season), {
      params: { language },
    })
    return data
  },

  async getEpisode(
    id: number,
    season: number,
    episode: number,
    language = 'es-ES'
  ): Promise<Episode> {
    const { data } = await client.get(TV_ENDPOINTS.EPISODE(id, season, episode), {
      params: { language },
    })
    return data
  },

  async getCredits(id: number) {
    const { data } = await client.get(TV_ENDPOINTS.CREDITS(id))
    return data
  },

  async getVideos(id: number, language = 'es-ES') {
    const { data } = await client.get(TV_ENDPOINTS.VIDEOS(id), {
      params: { language },
    })
    return data
  },

  async getRecommendations(id: number, page = 1): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get(TV_ENDPOINTS.RECOMMENDATIONS(id), {
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
  ): Promise<PaginatedResponse<Series>> {
    const { data } = await client.get('/discover/tv', {
      params: {
        page,
        language: 'es-ES',
        region: 'ES',
        sort_by: filters.sortBy || 'popularity.desc',
        with_genres: filters.genres?.join(','),
        first_air_date_year: filters.year,
        'vote_average.gte': filters.minRating,
      },
    })
    return data
  },
}
