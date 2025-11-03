import client from './api/client'
import { GENRE_ENDPOINTS } from './api/endpoints'
import type { Genre } from '@/types'

interface GenreResponse {
  genres: Genre[]
}

class GenresService {
  private genresCacheMovie: Genre[] | null = null
  private genresCacheTV: Genre[] | null = null

  async getMovieGenres(): Promise<Genre[]> {
    if (this.genresCacheMovie) return this.genresCacheMovie

    const { data } = await client.get<GenreResponse>(GENRE_ENDPOINTS.MOVIES, {
      params: { language: 'es-ES' },
    })
    this.genresCacheMovie = data.genres
    return data.genres
  }

  async getTVGenres(): Promise<Genre[]> {
    if (this.genresCacheTV) return this.genresCacheTV

    const { data } = await client.get<GenreResponse>(GENRE_ENDPOINTS.TV, {
      params: { language: 'es-ES' },
    })
    this.genresCacheTV = data.genres
    return data.genres
  }

  clearCache(): void {
    this.genresCacheMovie = null
    this.genresCacheTV = null
  }

  getGenreNameById(id: number, type: 'movie' | 'tv' = 'movie'): string | null {
    const cache = type === 'movie' ? this.genresCacheMovie : this.genresCacheTV
    if (!cache) return null

    const genre = cache.find((g) => g.id === id)
    return genre?.name || null
  }
}

export const genresService = new GenresService()
